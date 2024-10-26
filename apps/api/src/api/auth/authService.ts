import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { LoginInput, LoginResponse, SignUpInput, Tokens } from "./authModel";

import { ServiceResponse } from "@/common/models/serviceResponse";

import { createResetPasswordToken, getResetPasswordToken } from "@/data-access/resetPasswordTokens";

import {
  deleteAllRefreshTokens,
  deleteRefreshToken,
  getRefreshToken,
  saveRefreshToken,
  updateRefreshToken,
} from "@/data-access/refreshTokens";

import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmation,
} from "@/data-access/twoFactorConfirmation";

import { deleteTwoFactorToken, getTwoFactorTokenByEmail } from "@/data-access/twoFactorToken";
import { createUserSettings } from "@/data-access/userSettings";
import { createUser, getUserByEmail, getUserSettingsByUserId, updateUserEmailVerification } from "@/data-access/users";
import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationToken,
} from "@/data-access/verificationToken";

import { applicationName, cookie, saltRounds } from "@/common/utils/config";
import { sendEmail } from "@/common/utils/mail";
import { logger } from "@/server";
import { TokenExpiredError, decode, sign, verify } from "jsonwebtoken";

const signUp = async ({ email, name, password }: SignUpInput): Promise<ServiceResponse<{ id: string } | null>> => {
  try {
    const isExistingUser = await getUserByEmail(email);

    if (isExistingUser) {
      if (!isExistingUser.emailVerified) {
        return ServiceResponse.failure("Please verify your email", null, StatusCodes.CONFLICT);
      }
      return ServiceResponse.failure("User already exists", null, StatusCodes.CONFLICT);
    }

    const user = await createUser({
      email,
      name,
      password,
    });

    await createUserSettings({ userId: user.id });

    const token = await createVerificationToken(user.id);

    await sendEmail(email, `Verify your email for ${applicationName}`, token);

    return ServiceResponse.success<{ id: string }>("User created", { id: user.id }, StatusCodes.CREATED);
  } catch (ex) {
    const errorMessage = `Error signing up: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while signing up.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const login = async ({ email, password, code }: LoginInput): Promise<ServiceResponse<LoginResponse | null>> => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
    }

    if (!user.emailVerified) {
      return ServiceResponse.failure("Email not verified", null, StatusCodes.UNAUTHORIZED);
    }

    const isValidPassword = await comparePassword(password, user.password!);
    if (!isValidPassword) {
      return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
    }

    const userSettings = await getUserSettingsByUserId(user.id);

    if (userSettings?.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(email);

        if (!twoFactorToken || twoFactorToken.token !== code) {
          return ServiceResponse.failure("Invalid two-factor code", null, StatusCodes.UNAUTHORIZED);
        }

        if (new Date(twoFactorToken.expires) < new Date()) {
          return ServiceResponse.failure("Two-factor code expired", null, StatusCodes.UNAUTHORIZED);
        }

        await deleteTwoFactorToken(twoFactorToken.id);
        await createTwoFactorConfirmation(user.id);
      } else {
        const twoFactorConfirmation = await getTwoFactorConfirmation(user.id);

        if (!twoFactorConfirmation) {
          return ServiceResponse.failure("Two-factor authentication required", null, StatusCodes.UNAUTHORIZED);
        }

        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }
    }

    return ServiceResponse.success<LoginResponse>(
      "Login successful",
      {
        id: user.id,
        email: user.email,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    const errorMessage = `Error signing in: $${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while signing in.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const forgotPassword = async (email: string): Promise<ServiceResponse<null>> => {
  try {
    const user = await getUserByEmail(email);

    if (!user || !user.emailVerified) {
      return ServiceResponse.failure("User not found or email not verified", null, StatusCodes.NOT_FOUND);
    }

    const token = await createResetPasswordToken(user.id);

    await sendEmail(email, `Reset your password for ${applicationName}`, token);

    return ServiceResponse.success<null>("Password reset email sent", null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error resetting password: $${(ex as Error).message}`;
    logger.error(errorMessage);

    return ServiceResponse.failure(
      "An error occurred while resetting password.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const resetPassword = async (token: string, newPassword: string): Promise<ServiceResponse<null>> => {
  try {
    const existingToken = await getResetPasswordToken(token);

    if (!existingToken || existingToken.expires < new Date()) {
      return ServiceResponse.failure("Invalid or expired token ", null, StatusCodes.UNAUTHORIZED);
    }

    const userId = existingToken.userId;

    // await createTransaction(async (trx) => {
    //   await updatePassword(userId, newPassword, trx);
    //   await deleteResetPasswordToken(token, trx);
    // });

    return ServiceResponse.success<null>("Password changed successfully", null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error changing password: $${(ex as Error).message}`;
    logger.error(errorMessage);

    return ServiceResponse.failure(
      "An error occurred while changing password.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const refreshToken = async (userId: string, email: string) => {
  const { accessToken, refreshToken } = generateTokens(userId);

  await updateRefreshToken(userId, refreshToken);

  return {
    accessToken,
    refreshToken,
    id: userId,
    email,
  };
};

const verifyEmail = async (token: string): Promise<ServiceResponse<null>> => {
  try {
    const existingToken = await getVerificationToken(token);

    if (!existingToken || existingToken.expires < new Date()) {
      return ServiceResponse.failure("Invalid or expired token", null, StatusCodes.UNAUTHORIZED);
    }

    await updateUserEmailVerification(existingToken.userId);
    await deleteVerificationToken(token);

    return ServiceResponse.success<null>("Email verified", null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error verifying email: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while verifying email.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const logout = async (req: Request, res: Response): Promise<ServiceResponse<null>> => {
  try {
    const cookies = req.cookies;

    const refreshToken = cookies[cookie.refreshToken.name];

    if (!refreshToken) return ServiceResponse.failure("No refresh token found", null, StatusCodes.UNAUTHORIZED);

    const existingToken = await getRefreshToken(refreshToken);

    if (!existingToken) {
      res.clearCookie(cookie.refreshToken.name);
      return ServiceResponse.success<null>("", null, StatusCodes.NO_CONTENT);
    }

    await deleteRefreshToken(refreshToken);
    res.clearCookie(cookie.refreshToken.name);
    return ServiceResponse.success<null>("", null, StatusCodes.NO_CONTENT);
  } catch (ex) {
    const errorMessage = `Error logging out: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while logging out.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const sendVerificationEmail = async (email: string) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
    }

    if (user.emailVerified) {
      return ServiceResponse.failure("User already verified", null, StatusCodes.CONFLICT);
    }

    const existingToken = await getVerificationToken(user.id);

    if (existingToken && existingToken.expires > new Date()) {
      return ServiceResponse.failure("Verification token already exists", null, StatusCodes.CONFLICT);
    }

    const token = await createVerificationToken(user.id);

    await sendEmail(email, `Verify your email for ${applicationName}`, token);

    if (existingToken) {
      await deleteVerificationToken(existingToken.token);
    }

    return ServiceResponse.success<null>("Email sent", null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error logging out: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while logging out.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies[cookie.refreshToken.name];
    if (!refreshToken) {
      return ServiceResponse.failure("Unauthorized", null, StatusCodes.FORBIDDEN);
    }

    let error: string | null = null;
    let newRefreshToken: string | null = null;
    const accessToken = "";

    const existingToken = await getRefreshToken(refreshToken);

    if (!existingToken) {
      // Detected refresh token reuse (invalid token)
      verify(refreshToken, cookie.refreshToken.name, async (err: unknown, payload: any) => {
        const decodedToken = decode(refreshToken);

        logger.warn(`Refresh token reuse detected for user: ${decodedToken?.sub}`);

        await deleteAllRefreshTokens(decodedToken?.sub);
      });

      return ServiceResponse.failure("Unauthorized", null, StatusCodes.FORBIDDEN);
    }

    verify(refreshToken, cookie.refreshToken.secret, async (err: unknown, payload: any) => {
      if (err instanceof TokenExpiredError) {
        const decodedToken = decode(refreshToken);

        await deleteRefreshToken(refreshToken);
        newRefreshToken = generateRefreshToken(decodedToken?.sub);

        await saveRefreshToken(decodedToken?.sub, newRefreshToken);
        res.clearCookie(cookie.refreshToken.name);
        res.cookie(cookie.refreshToken.name, newRefreshToken, {
          httpOnly: true,
          expires: new Date(Date.now() + cookie.refreshToken.expires),
        });
        error = "Expired";
        return;
      }
    });

    if (error === "Unauthorized") {
      return ServiceResponse.failure(error, null, StatusCodes.FORBIDDEN);
    } else if (error === "Expired") {
      return ServiceResponse.failure(error, null, StatusCodes.FORBIDDEN);
    }

    return ServiceResponse.success<Tokens>(
      "New access token",
      { accessToken, refreshToken: newRefreshToken },
      StatusCodes.OK,
    );
  } catch (ex) {
    const errorMessage = `Error handle refresh token: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const generateAccessToken = (userId: string) => {
  return sign({ sub: userId }, cookie.accessToken.secret, {
    expiresIn: cookie.accessToken.expiresIn,
    algorithm: cookie.accessToken.algorithm,
  });
};

const generateRefreshToken = (userId: string) => {
  return sign({ sub: userId }, cookie.refreshToken.secret, {
    expiresIn: cookie.refreshToken.expiresIn,
    algorithm: cookie.refreshToken.algorithm,
  });
};

const generateTokens = (userId: string) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return { accessToken, refreshToken };
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (plainTextPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const validateGoogleUser = async (email: string, password: string) => {
  const existingUser = (await getUserByEmail(email, {
    id: true,
  })) as { id: string };

  if (existingUser) return existingUser;

  return await createUser({
    email,
    emailVerified: new Date(),
    name: email,
  });
};

export const authService = {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  sendVerificationEmail,
  handleRefreshToken,
  refreshToken,
  validateGoogleUser,
  hashPassword,
  comparePassword,
};

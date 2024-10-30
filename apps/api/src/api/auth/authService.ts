import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { hashToken, verifyToken } from "./../../common/utils/token";
import type { LoginInput, LoginResponse, SignUpInput } from "./authModel";

import { ServiceResponse } from "@/common/models/serviceResponse";

import {
  createResetPasswordToken,
  deleteResetPasswordToken,
  getResetPasswordTokenByToken,
} from "@/data-access/resetPasswordTokens";

import { deleteRefreshToken, getRefreshTokenByUserId, updateRefreshToken } from "@/data-access/refreshTokens";

import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmation,
} from "@/data-access/twoFactorConfirmation";

import { deleteTwoFactorToken, getTwoFactorTokenByEmail } from "@/data-access/twoFactorToken";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserSettingsByUserId,
  updatePassword,
  updateUserEmailVerification,
} from "@/data-access/users";
import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByToken,
  getVerificationTokenByUserId,
} from "@/data-access/verificationToken";

import { applicationName, cookie, saltRounds } from "@/common/config/config";
import { env } from "@/common/config/env";
import { createTransaction } from "@/common/utils/db";
import { UnauthorizedError } from "@/common/utils/errors";
import { sendEmail } from "@/common/utils/mail";
import { logger } from "@/server";
import { sign } from "jsonwebtoken";

const signIn = async (userId: string, email: string, isTwoFactorEnabled: boolean) => {
  const { accessToken, refreshToken } = generateTokens(userId);

  const hashedRefreshToken = hashToken(refreshToken, env.REFRESH_TOKEN_SECRET);

  await updateRefreshToken(userId, hashedRefreshToken);

  const serviceResponse = ServiceResponse.success(
    "Sign in successful",
    { accessToken, refreshToken, user: { id: userId, email }, isTwoFactorEnabled },
    StatusCodes.OK,
  );

  return serviceResponse;
};

const signUp = async ({ email, name, password }: SignUpInput): Promise<ServiceResponse<{ id: string } | null>> => {
  try {
    const isExistingUser = await getUserByEmail(email, {
      id: true,
      emailVerified: true,
    });

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

    const token = await createVerificationToken(user.id);

    await sendEmail(email, `Verify your email for ${applicationName}`, token);

    return ServiceResponse.success<{ id: string }>("User created", { id: user.id }, StatusCodes.CREATED);
  } catch (ex) {
    const errorMessage = `Error signing up: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while signing up.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const validateLocalUser = async ({
  email,
  password,
  code,
}: LoginInput): Promise<ServiceResponse<LoginResponse | null>> => {
  try {
    const user = await getUserByEmail(email, {
      id: true,
      emailVerified: true,
      password: true,
      email: true,
    });

    if (!user || !user.id || !user.password) {
      return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
    }

    if (!user.emailVerified) {
      return ServiceResponse.failure("Email not verified", null, StatusCodes.UNAUTHORIZED);
    }

    const isValidPassword = await comparePassword(password, user.password);

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

        await createTransaction(async (trx) => {
          await deleteTwoFactorToken(twoFactorToken.id, trx);
          await createTwoFactorConfirmation(user.id!, trx);
        });
      } else {
        const twoFactorConfirmation = await getTwoFactorConfirmation(user.id);

        if (!twoFactorConfirmation) {
          return ServiceResponse.failure("Two-factor authentication required", null, StatusCodes.UNAUTHORIZED);
        }

        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }
    }

    return ServiceResponse.success<LoginResponse>(
      "Sign in successful",
      {
        id: user.id,
        email: user.email!,
        isTwoFactorEnabled: userSettings?.isTwoFactorEnabled!,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    const errorMessage = `Error signing in: $${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while signing in.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const validateRefreshToken = async (userId: string, refreshToken: string) => {
  const user = await getUserById<{
    id: string;
    email: string;
  }>(userId, { id: true, email: true });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  const existingToken = await getRefreshTokenByUserId(userId);

  if (!existingToken) {
    throw new UnauthorizedError("Refresh token not found");
  }

  const isTokenValid = verifyToken(refreshToken, existingToken.token, env.REFRESH_TOKEN_SECRET);

  if (!isTokenValid) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  return {
    id: user.id,
    email: user.email,
  };
};

const forgotPassword = async (email: string): Promise<ServiceResponse<null>> => {
  try {
    const user = await getUserByEmail(email, {
      id: true,
      emailVerified: true,
    });

    if (!user || !user.emailVerified || !user.id) {
      return ServiceResponse.success(
        "If a matching account is found, a password reset email will be sent",
        null,
        StatusCodes.OK,
      );
    }

    const token = await createResetPasswordToken(user.id);

    await sendEmail(email, `Reset your password for ${applicationName}`, token);

    return ServiceResponse.success<null>(
      "If a matching account is found, a password reset email will be sent",
      null,
      StatusCodes.OK,
    );
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
    const existingToken = await getResetPasswordTokenByToken(token);

    if (!existingToken || existingToken.expires < new Date()) {
      return ServiceResponse.failure("Invalid or expired token ", null, StatusCodes.UNAUTHORIZED);
    }

    const userId = existingToken.userId;

    await createTransaction(async (trx) => {
      await updatePassword({ userId, newPassword, trx });
      await deleteResetPasswordToken(token, trx);
    });

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

  const hashedRefreshToken = hashToken(refreshToken, env.REFRESH_TOKEN_SECRET);
  await updateRefreshToken(userId, hashedRefreshToken);

  const serviceResponse = ServiceResponse.success(
    "Updated refresh token",
    { accessToken, refreshToken, user: { id: userId, email } },
    StatusCodes.OK,
  );

  return serviceResponse;
};

const verifyEmail = async (token: string): Promise<ServiceResponse<null>> => {
  try {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken || existingToken.expires < new Date()) {
      return ServiceResponse.failure("Invalid or expired token", null, StatusCodes.UNAUTHORIZED);
    }

    await createTransaction(async (trx) => {
      await updateUserEmailVerification(existingToken.userId, trx);
      await deleteVerificationToken(token, trx);
    });

    return ServiceResponse.success<null>("Email verified", null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error verifying email: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while verifying email.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const signOut = async (userId: string): Promise<ServiceResponse<null>> => {
  try {
    const existingToken = await getRefreshTokenByUserId(userId);

    if (!existingToken) {
      return ServiceResponse.failure("Invalid refresh token", null, StatusCodes.UNAUTHORIZED);
    }

    // Verify the token belongs to the user
    if (existingToken.userId !== userId) {
      return ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED);
    }

    await deleteRefreshToken(existingToken.token);

    return ServiceResponse.success<null>("Signed out", null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error logging out: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while logging out.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const sendVerificationEmail = async (email: string) => {
  try {
    const user = await getUserByEmail(email, {
      id: true,
    });

    if (!user || !user.id) {
      return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
    }

    if (user.emailVerified) {
      return ServiceResponse.failure("User already verified", null, StatusCodes.CONFLICT);
    }

    const existingToken = await getVerificationTokenByUserId(user.id);

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

export const authService = {
  signUp,
  validateLocalUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  signOut,
  sendVerificationEmail,
  refreshToken,
  hashPassword,
  comparePassword,
  signIn,
  validateRefreshToken,
  generateTokens,
};

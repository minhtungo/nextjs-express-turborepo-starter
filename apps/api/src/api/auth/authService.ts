import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { LoginResponse, Tokens } from './authModel';

import type { SignIn, SignUp } from '@/api/auth/authModel';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { applicationName, jwt } from '@/config';
import { updatePassword } from '@/data-access/accounts';

import {
  createResetPasswordToken,
  deleteResetPasswordToken,
  getResetPasswordToken,
} from '@/data-access/resetPasswordTokens';

import {
  deleteAllRefreshTokens,
  deleteRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from '@/data-access/refreshTokens';
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmation,
} from '@/data-access/twoFactorConfirmation';
import { deleteTwoFactorToken, getTwoFactorTokenByEmail } from '@/data-access/twoFactorToken';
import { createUserSettings } from '@/data-access/userSettings';
import { createUser, getUserByEmail, getUserSettingsByUserId, updateUserEmailVerification } from '@/data-access/users';
import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationToken,
} from '@/data-access/verificationToken';

import { logger } from '@/server';
import { TokenExpiredError, decode, verify } from 'jsonwebtoken';
import { comparePassword, createAccessToken, createRefreshToken } from '@/common/auth/utils';
import { sendEmail } from '@/common/utils/mail';

export class AuthService {
  async signUp({ email, name, password }: SignUp): Promise<ServiceResponse<{ id: string } | null>> {
    try {
      const isExistingUser = await getUserByEmail(email);

      if (isExistingUser) {
        if (!isExistingUser.emailVerified) {
          return ServiceResponse.failure('Please verify your email', null, StatusCodes.CONFLICT);
        }
        return ServiceResponse.failure('User already exists', null, StatusCodes.CONFLICT);
      }

      const user = await createUser({
        email,
        name,
        password,
      });

      await createUserSettings({ userId: user.id });

      const token = await createVerificationToken(user.id);

      await sendEmail(email, `Verify your email for ${applicationName}`, token);

      return ServiceResponse.success<{ id: string }>('User created', { id: user.id }, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error signing up: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure('An error occurred while signing up.', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async login({ email, password, code }: SignIn): Promise<ServiceResponse<LoginResponse | null>> {
    try {
      const existingUser = await getUserByEmail(email);

      if (!existingUser) {
        throw new Error('Invalid credentials');
      }

      if (!existingUser.emailVerified) {
        return ServiceResponse.failure(
          'Your email has not been verified. Please check your email.',
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const userSettings = await getUserSettingsByUserId(existingUser.id);

      if (userSettings?.isTwoFactorEnabled) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(email);

          if (!twoFactorToken) {
            return ServiceResponse.failure('No two-factor token found', null, StatusCodes.UNAUTHORIZED);
          }

          if (twoFactorToken.token !== code) {
            return ServiceResponse.failure('Invalid code', null, StatusCodes.UNAUTHORIZED);
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();

          if (hasExpired) {
            return ServiceResponse.failure(
              'Two-factor authentication code has expired',
              null,
              StatusCodes.UNAUTHORIZED
            );
          }

          await deleteTwoFactorToken(twoFactorToken.id);

          const existingConfirmation = await getTwoFactorConfirmation(existingUser.id);

          if (existingConfirmation) {
            await deleteTwoFactorConfirmation(existingConfirmation.id);
          }

          await createTwoFactorConfirmation(existingUser.id);
        } else {
          const twoFactorConfirmation = await getTwoFactorConfirmation(existingUser.id);

          if (!twoFactorConfirmation) {
            return ServiceResponse.failure('Two-factor authentication is required', null, StatusCodes.UNAUTHORIZED);
          }

          await deleteTwoFactorConfirmation(twoFactorConfirmation.id);

          const isValidPassword = await comparePassword(password, existingUser.password!);

          if (!isValidPassword) {
            return ServiceResponse.failure('Invalid credentials', null, StatusCodes.UNAUTHORIZED);
          }
        }
      }

      const isValidPassword = await comparePassword(password, existingUser.password!);

      if (!isValidPassword) {
        return ServiceResponse.failure('Invalid credentials', null, StatusCodes.UNAUTHORIZED);
      }

      const accessToken = createAccessToken({
        id: existingUser.id,
        email: existingUser.email,
      });

      const refreshToken = createRefreshToken({
        id: existingUser.id,
        email: existingUser.email,
      });

      await saveRefreshToken(existingUser.id, refreshToken);

      return ServiceResponse.success<LoginResponse>(
        'Login successful',
        {
          accessToken,
          refreshToken,
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error signing in: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure('An error occurred while signing in.', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async forgotPassword(email: string): Promise<ServiceResponse<null>> {
    try {
      const user = await getUserByEmail(email);

      if (!user || !user.emailVerified) {
        return ServiceResponse.failure('User not found or email not verified', null, StatusCodes.NOT_FOUND);
      }

      const token = await createResetPasswordToken(user.id);

      await sendEmail(email, `Reset your password for ${applicationName}`, token);

      return ServiceResponse.success<null>('Password reset email sent', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error resetting password: $${(ex as Error).message}`;
      logger.error(errorMessage);

      return ServiceResponse.failure(
        'An error occurred while resetting password.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ServiceResponse<null>> {
    try {
      const existingToken = await getResetPasswordToken(token);

      if (!existingToken || existingToken.expires < new Date()) {
        return ServiceResponse.failure('Invalid or expired token ', null, StatusCodes.UNAUTHORIZED);
      }

      const userId = existingToken.userId;

      // await createTransaction(async (trx) => {
      //   await updatePassword(userId, newPassword, trx);
      //   await deleteResetPasswordToken(token, trx);
      // });

      return ServiceResponse.success<null>('Password changed successfully', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error changing password: $${(ex as Error).message}`;
      logger.error(errorMessage);

      return ServiceResponse.failure(
        'An error occurred while changing password.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyEmail(token: string): Promise<ServiceResponse<null>> {
    try {
      const existingToken = await getVerificationToken(token);

      if (!existingToken || existingToken.expires < new Date()) {
        return ServiceResponse.failure('Invalid or expired token', null, StatusCodes.UNAUTHORIZED);
      }

      await updateUserEmailVerification(existingToken.userId);
      await deleteVerificationToken(token);

      return ServiceResponse.success<null>('Email verified', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error verifying email: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while verifying email.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async logout(req: Request, res: Response): Promise<ServiceResponse<null>> {
    try {
      const cookies = req.cookies;

      const refreshToken = cookies[jwt.refreshToken.cookie_name];

      if (!refreshToken) return ServiceResponse.failure('No refresh token found', null, StatusCodes.UNAUTHORIZED);

      const existingToken = await getRefreshToken(refreshToken);

      if (!existingToken) {
        res.clearCookie(jwt.refreshToken.cookie_name);
        return ServiceResponse.success<null>('', null, StatusCodes.NO_CONTENT);
      }

      await deleteRefreshToken(refreshToken);
      res.clearCookie(jwt.refreshToken.cookie_name);
      return ServiceResponse.success<null>('', null, StatusCodes.NO_CONTENT);
    } catch (ex) {
      const errorMessage = `Error logging out: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure('An error occurred while logging out.', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async sendVerificationEmail(email: string) {
    try {
      const user = await getUserByEmail(email);

      if (!user) {
        return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
      }

      if (user.emailVerified) {
        return ServiceResponse.failure('User already verified', null, StatusCodes.CONFLICT);
      }

      const existingToken = await getVerificationToken(user.id);

      if (existingToken && existingToken.expires > new Date()) {
        return ServiceResponse.failure('Verification token already exists', null, StatusCodes.CONFLICT);
      }

      const token = await createVerificationToken(user.id);

      await sendEmail(email, `Verify your email for ${applicationName}`, token);

      if (existingToken) {
        await deleteVerificationToken(existingToken.token);
      }

      return ServiceResponse.success<null>('Email sent', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error logging out: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure('An error occurred while logging out.', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async handleRefreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies[jwt.refreshToken.cookie_name];
      if (!refreshToken) {
        return ServiceResponse.failure('Unauthorized', null, StatusCodes.FORBIDDEN);
      }

      let error: string | null = null;
      let newRefreshToken: string | null = null;
      const accessToken = '';

      const existingToken = await getRefreshToken(refreshToken);

      if (!existingToken) {
        // Detected refresh token reuse (invalid token)
        verify(refreshToken, jwt.refreshToken.secret, async (err: unknown, payload: any) => {
          const decodedToken = decode(refreshToken);

          logger.warn(`Refresh token reuse detected for user: ${decodedToken?.sub}`);

          await deleteAllRefreshTokens(decodedToken?.sub);
        });

        return ServiceResponse.failure('Unauthorized', null, StatusCodes.FORBIDDEN);
      }

      verify(refreshToken, jwt.refreshToken.secret, async (err: unknown, payload: any) => {
        if (err instanceof TokenExpiredError) {
          const decodedToken = decode(refreshToken);

          await deleteRefreshToken(refreshToken);
          newRefreshToken = createRefreshToken({
            id: decodedToken?.sub,
            email: decodedToken?.email,
            provider: decodedToken?.provider,
          });
          await saveRefreshToken(decodedToken?.sub, newRefreshToken);
          res.clearCookie(jwt.refreshToken.cookie_name);
          res.cookie(jwt.refreshToken.cookie_name, newRefreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + jwt.refreshToken.expires),
          });
          error = 'Expired';
          return;
        }
      });

      if (error === 'Unauthorized') {
        return ServiceResponse.failure(error, null, StatusCodes.FORBIDDEN);
      } else if (error === 'Expired') {
        return ServiceResponse.failure(error, null, StatusCodes.FORBIDDEN);
      }

      return ServiceResponse.success<Tokens>(
        'New access token',
        { accessToken, refreshToken: newRefreshToken },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error handle refresh token: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure('An error occurred.', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const authService = new AuthService();

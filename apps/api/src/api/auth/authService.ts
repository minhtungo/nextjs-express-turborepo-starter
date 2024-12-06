import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '@/common/models/serviceResponse';

import { authRepository } from './authRepository';

import { User } from '@/api/user/userModel';
import { userRepository } from '@/api/user/userRepository';
import { applicationName, tokenTtl } from '@/common/config/config';
import { createTransaction } from '@/common/utils/db';
import { sendEmail } from '@/common/utils/mail';
import { verifyPassword } from '@/common/utils/password';
import { logger } from '@/server';
import { signInProps, signUpProps } from '@repo/types';
import { generateSecureToken, hashToken } from '@/common/utils/token';
import { db, resetPasswordTokens } from '@repo/database';

const signIn = async () => {
  const serviceResponse = ServiceResponse.success('Sign in successfully', null, StatusCodes.OK);

  return serviceResponse;
};

const signUp = async ({ email, name, password }: signUpProps): Promise<ServiceResponse<{ id: string } | null>> => {
  try {
    const isExistingUser = await userRepository.getUserByEmail(email, {
      id: true,
      emailVerified: true,
    });

    if (isExistingUser) {
      if (!isExistingUser.emailVerified) {
        return ServiceResponse.failure('Please verify your email', null, StatusCodes.CONFLICT);
      }
      return ServiceResponse.failure('User already exists', null, StatusCodes.CONFLICT);
    }

    const user = await userRepository.createUser({
      email,
      name,
      password,
    });

    const token = await authRepository.createVerificationToken(user.id);

    await sendEmail(email, `Verify your email for ${applicationName}`, token);

    return ServiceResponse.success<{ id: string }>('User created', { id: user.id }, StatusCodes.CREATED);
  } catch (ex) {
    const errorMessage = `Error signing up: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure('An error occurred while signing up.', null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const validateLocalUser = async ({
  email,
  password,
  code,
}: signInProps): Promise<ServiceResponse<Partial<User> | null>> => {
  try {
    const user = await userRepository.getUserByEmail(email);

    if (!user || !user.id || !user.password) {
      return ServiceResponse.failure('Invalid credentials', null, StatusCodes.UNAUTHORIZED);
    }

    if (!user.emailVerified) {
      return ServiceResponse.failure('Email not verified', null, StatusCodes.UNAUTHORIZED);
    }

    const isValidPassword = await verifyPassword(user.password, password);

    if (!isValidPassword) {
      return ServiceResponse.failure('Invalid credentials', null, StatusCodes.UNAUTHORIZED);
    }

    const userSettings = await userRepository.getUserSettingsByUserId(user.id);

    if (userSettings?.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken = await authRepository.getTwoFactorTokenByEmail(email);

        if (!twoFactorToken || twoFactorToken.token !== code) {
          return ServiceResponse.failure('Invalid two-factor code', null, StatusCodes.UNAUTHORIZED);
        }

        if (new Date(twoFactorToken.expires) < new Date()) {
          return ServiceResponse.failure('Two-factor code expired', null, StatusCodes.UNAUTHORIZED);
        }

        await createTransaction(async (trx) => {
          await authRepository.deleteTwoFactorToken(twoFactorToken.id, trx);
          await authRepository.createTwoFactorConfirmation(user.id!, trx);
        });
      } else {
        const twoFactorConfirmation = await authRepository.getTwoFactorConfirmation(user.id);

        if (!twoFactorConfirmation) {
          return ServiceResponse.failure('Two-factor authentication required', null, StatusCodes.UNAUTHORIZED);
        }

        await authRepository.deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }
    }

    return ServiceResponse.success<Partial<User>>('Sign in successful', user, StatusCodes.OK);
  } catch (error) {
    const errorMessage = `Error signing in: $${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure('An error occurred while signing in.', null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const forgotPassword = async (email: string): Promise<ServiceResponse<null>> => {
  try {
    const user = await userRepository.getUserByEmail(email, {
      id: true,
      emailVerified: true,
    });

    if (!user || !user.emailVerified || !user.id) {
      return ServiceResponse.success(
        'If a matching account is found, a password reset email will be sent',
        null,
        StatusCodes.OK
      );
    }

    const token = await authRepository.createResetPasswordToken(user.id);

    await sendEmail(email, `Reset your password for ${applicationName}`, token);

    return ServiceResponse.success<null>(
      'If a matching account is found, a password reset email will be sent',
      null,
      StatusCodes.OK
    );
  } catch (ex) {
    const errorMessage = `Error resetting password: $${(ex as Error).message}`;
    logger.error(errorMessage);

    return ServiceResponse.failure(
      'An error occurred while resetting password.',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const resetPassword = async (token: string, newPassword: string): Promise<ServiceResponse<null>> => {
  try {
    const hashedToken = hashToken(token);
    const existingToken = await authRepository.getResetPasswordTokenByToken(hashedToken);

    if (!existingToken || existingToken.expires < new Date()) {
      return ServiceResponse.failure('Invalid or expired token ', null, StatusCodes.UNAUTHORIZED);
    }

    const userId = existingToken.userId;

    await createTransaction(async (trx) => {
      await userRepository.updatePassword({ userId, newPassword, trx });
      await authRepository.deleteResetPasswordToken(hashedToken, trx);
    });

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
};

const verifyEmail = async (token: string): Promise<ServiceResponse<null>> => {
  try {
    const existingToken = await authRepository.getVerificationTokenByToken(token);

    if (!existingToken || existingToken.expires < new Date()) {
      return ServiceResponse.failure('Invalid or expired token', null, StatusCodes.UNAUTHORIZED);
    }

    await createTransaction(async (trx) => {
      await userRepository.updateUserEmailVerification(existingToken.userId, trx);
      await authRepository.deleteVerificationToken(token, trx);
    });

    return ServiceResponse.success<null>('Email verified', null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error verifying email: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure('An error occurred while verifying email.', null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const signOut = async (): Promise<ServiceResponse<null>> => {
  try {
    // Verify the token belongs to the user

    return ServiceResponse.success<null>('Signed out', null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error logging out: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure('An error occurred while logging out.', null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const sendVerificationEmail = async (email: string) => {
  try {
    const user = await userRepository.getUserByEmail(email, {
      id: true,
    });

    if (!user || !user.id) {
      return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.emailVerified) {
      return ServiceResponse.failure('User already verified', null, StatusCodes.CONFLICT);
    }

    const existingToken = await authRepository.getVerificationTokenByUserId(user.id);

    if (existingToken && existingToken.expires > new Date()) {
      return ServiceResponse.failure('Verification token already exists', null, StatusCodes.CONFLICT);
    }

    const token = await authRepository.createVerificationToken(user.id);

    await sendEmail(email, `Verify your email for ${applicationName}`, token);

    if (existingToken) {
      await authRepository.deleteVerificationToken(existingToken.token);
    }

    return ServiceResponse.success<null>('Email sent', null, StatusCodes.OK);
  } catch (ex) {
    const errorMessage = `Error logging out: $${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure('An error occurred while logging out.', null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getSession = async (user: Express.User | undefined): Promise<ServiceResponse<{ user: Express.User } | null>> => {
  if (!user) {
    return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
  }

  return ServiceResponse.success(
    'Retrieved session',
    {
      user,
    },
    StatusCodes.OK
  );
};

export const authService = {
  signUp,
  getSession,
  validateLocalUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  signOut,
  sendVerificationEmail,
  signIn,
};

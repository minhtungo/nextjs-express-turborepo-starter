import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '@/common/models/serviceResponse';

import { authRepository } from './authRepository';

import { userRepository } from '@/api/user/userRepository';
import { applicationName } from '@/common/config/config';
import { createTransaction } from '@/common/lib/db';
import { verifyPassword } from '@/common/lib/password';
import { hashToken } from '@/common/lib/token';
import { logger } from '@/server';
import { signInProps, signUpProps } from '@repo/types';
import { handleServiceError } from '@/common/lib/utils';
import { emailService } from '@/common/lib/emailService';

const signIn = async () => {
  const serviceResponse = ServiceResponse.success('Sign in successfully', null, StatusCodes.OK);

  return serviceResponse;
};

const signUp = async ({ email, name, password }: signUpProps): Promise<ServiceResponse<{ id: string } | null>> => {
  try {
    const isExistingUser = await userRepository.getUserByEmail(email);

    if (isExistingUser) {
      return ServiceResponse.success(
        'If your email is not registered, you will receive a verification email shortly.',
        null,
        StatusCodes.OK
      );
    }

    const user = await userRepository.createUser({
      email,
      name,
      password,
    });

    const token = await authRepository.createVerificationToken(user.id!);

    await emailService.sendVerificationEmail(email, name, token);

    return ServiceResponse.success(
      'If your email is not registered, you will receive a verification email shortly.',
      null,
      StatusCodes.OK
    );
  } catch (ex) {
    return handleServiceError(ex as Error, 'Signing Up');
  }
};

const validateLocalUser = async ({
  email,
  password,
  code,
}: signInProps): Promise<
  ServiceResponse<{
    id: string;
    email: string;
  } | null>
> => {
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

    return ServiceResponse.success<{
      id: string;
      email: string;
    }>(
      'Sign in successful',
      {
        id: user.id,
        email: user.email,
      },
      StatusCodes.OK
    );
  } catch (error) {
    return handleServiceError(error as Error, 'Signing In');
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

    await emailService.sendPasswordResetEmail(email, user.name!, token);

    return ServiceResponse.success<null>(
      'If a matching account is found, a password reset email will be sent',
      null,
      StatusCodes.OK
    );
  } catch (ex) {
    return handleServiceError(ex as Error, 'Resetting Password');
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
    return handleServiceError(ex as Error, 'Resetting Password');
  }
};

const verifyEmail = async (token: string): Promise<ServiceResponse<null>> => {
  try {
    const existingToken = await authRepository.getVerificationTokenByToken(token);

    if (!existingToken || existingToken.expires < new Date()) {
      return ServiceResponse.failure(
        'This verification link has expired. Please request a new one.',
        null,
        StatusCodes.GONE // 410 status indicates expired resource
      );
    }

    await createTransaction(async (trx) => {
      await userRepository.updateUser(existingToken.userId, { emailVerified: new Date() }, trx);
      await authRepository.deleteVerificationToken(token, trx);
    });

    return ServiceResponse.success<null>('Email verified', null, StatusCodes.OK);
  } catch (ex) {
    return handleServiceError(ex as Error, 'Verifying Email');
  }
};

const signOut = async (): Promise<ServiceResponse<null>> => {
  try {
    // Verify the token belongs to the user

    return ServiceResponse.success<null>('Signed out', null, StatusCodes.OK);
  } catch (ex) {
    return handleServiceError(ex as Error, 'Signing Out');
  }
};

const sendVerificationEmail = async (token: string) => {
  try {
    const existingToken = await authRepository.getVerificationTokenByToken(token);

    if (!existingToken) {
      return ServiceResponse.success(
        'If a valid verification token exists, a new verification email will be sent.',
        null,
        StatusCodes.OK
      );
    }

    const user = await userRepository.getUserById(existingToken.userId);

    if (!user || user.emailVerified) {
      return ServiceResponse.success(
        'If a valid verification token exists, a new verification email will be sent.',
        null,
        StatusCodes.OK
      );
    }

    await createTransaction(async (trx) => {
      const newToken = await authRepository.createVerificationToken(user.id!, trx);
      await emailService.sendVerificationEmail(user.email, user.name!, newToken);
      await authRepository.deleteVerificationToken(existingToken.token, trx);
    });

    return ServiceResponse.success(
      'If a valid verification token exists, a new verification email will be sent.',
      null,
      StatusCodes.OK
    );
  } catch (ex) {
    return handleServiceError(ex as Error, 'Sending Verification Email');
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

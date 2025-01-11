import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '@/common/models/serviceResponse';

import { authRepository } from './authRepository';

import { emailService } from '@/common/lib/emailService';
import { logger } from '@/common/lib/logger';
import { verifyPassword } from '@/common/lib/password';
import { handleServiceError } from '@/common/lib/utils';
import { userRepository } from '@/modules/user/userRepository';
import { createTransaction } from '@repo/database/utils';
import type { signUpProps } from '@repo/validation/auth';
import type { SessionUser } from '@repo/validation/user';

const signUp = async ({ email, name, password }: signUpProps): Promise<ServiceResponse<{ id: string } | null>> => {
  try {
    const existingUser = await userRepository.getUserByEmail(email);

    if (existingUser) {
      if (existingUser.emailVerified) {
        return ServiceResponse.success(
          'If your email is not registered, you will receive a verification email shortly.',
          null,
          StatusCodes.OK
        );
      }

      const existingToken = await authRepository.getVerificationTokenByUserId(existingUser.id!);

      if (existingToken && existingToken.expires < new Date()) {
        await createTransaction(async (trx) => {
          // Delete old token
          await authRepository.deleteVerificationToken(existingToken.token, trx);

          // Create new token
          const newToken = await authRepository.createVerificationEmailToken(existingUser.id!, trx);

          try {
            await emailService.sendVerificationEmail(email, existingUser.name!, newToken);
          } catch (emailError) {
            throw new Error(`Failed to send verification email: ${emailError}`);
          }
        });
      }

      return ServiceResponse.success(
        'If your email is not registered, you will receive a verification email shortly.',
        null,
        StatusCodes.OK
      );
    }

    await createTransaction(async (trx) => {
      const user = await userRepository.createUser(
        {
          email,
          name,
          password,
        },
        trx
      );

      const token = await authRepository.createVerificationEmailToken(user.id, trx);

      await emailService.sendVerificationEmail(email, name, token);
    });

    return ServiceResponse.success(
      'If your email is not registered, you will receive a verification email shortly.',
      null,
      StatusCodes.OK
    );
  } catch (ex) {
    return handleServiceError(ex as Error, 'Signing Up');
  }
};

const authenticateUser = async (
  email: string,
  password: string,
  code?: string
): Promise<ServiceResponse<{ id: string } | null>> => {
  try {
    const user = await userRepository.getUserByEmail(email);

    if (!user?.id || !user.password || !user.emailVerified) {
      return ServiceResponse.failure('Invalid credentials', null, StatusCodes.UNAUTHORIZED);
    }

    const isValidPassword = await verifyPassword(user.password, password);

    if (!isValidPassword) {
      return ServiceResponse.failure('Invalid credentials', null, StatusCodes.UNAUTHORIZED);
    }

    const userSettings = await userRepository.getUserSettingsByUserId(user.id);

    if (userSettings?.isTwoFactorEnabled) {
      const isValidTwoFactor = await validateTwoFactorAuth(user.id, email, code);
      if (!isValidTwoFactor) {
        return ServiceResponse.failure('Invalid credentials', null, StatusCodes.UNAUTHORIZED);
      }
    }

    return ServiceResponse.success(
      'Sign in successfully',
      {
        id: user.id,
        email: user.email,
        image: user.image,
        name: user.name,
      },
      StatusCodes.OK
    );
  } catch (ex) {
    console.error('Error validating credentials:', ex);
    return handleServiceError(ex as Error, 'Authenticating User');
  }
};

// Helper function to handle 2FA validation
const validateTwoFactorAuth = async (userId: string, email: string, code?: string): Promise<boolean> => {
  if (!code) {
    const twoFactorConfirmation = await authRepository.getTwoFactorConfirmation(userId);
    if (!twoFactorConfirmation) {
      return false;
    }
    await authRepository.deleteTwoFactorConfirmation(twoFactorConfirmation.id);
    return true;
  }

  const twoFactorToken = await authRepository.getTwoFactorTokenByEmail(email);
  if (!twoFactorToken || twoFactorToken.token !== code || new Date(twoFactorToken.expires) < new Date()) {
    return false;
  }

  await createTransaction(async (trx) => {
    await authRepository.deleteTwoFactorToken(twoFactorToken.id, trx);
    await authRepository.createTwoFactorConfirmation(userId, trx);
  });

  return true;
};

const forgotPassword = async (email: string): Promise<ServiceResponse<null>> => {
  try {
    const user = await userRepository.getUserByEmail(email);

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
    const existingToken = await authRepository.getResetPasswordTokenByToken(token);
    if (!existingToken || existingToken.expires < new Date()) {
      return ServiceResponse.failure('Invalid or expired token ', null, StatusCodes.UNAUTHORIZED);
    }

    const userId = existingToken.userId;

    await createTransaction(async (trx) => {
      await userRepository.updatePassword({ userId, newPassword, trx });
      await authRepository.deleteResetPasswordToken(token, trx);
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
      await userRepository.updateUser(existingToken.userId, { emailVerified: new Date(), plan: 'free' }, trx);

      await authRepository.deleteVerificationToken(token, trx);
    });

    return ServiceResponse.success<null>('Your email has been verified. You can now sign in.', null, StatusCodes.OK);
  } catch (ex) {
    return handleServiceError(ex as Error, 'Verifying Email');
  }
};

const signOut = async (): Promise<ServiceResponse<null>> => {
  try {
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
      const newToken = await authRepository.createVerificationEmailToken(user.id!, trx);
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

const createSession = async (user: SessionUser, req: Express.Request): Promise<ServiceResponse<null>> => {
  try {
    await new Promise<void>((resolve, reject) => {
      req.login(user, (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    return ServiceResponse.success('Session created successfully', null);
  } catch (error) {
    logger.error('Error creating session:', error);
    return ServiceResponse.failure('Failed to create session', null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const destroySession = async (req: Express.Request): Promise<ServiceResponse<null>> => {
  try {
    await new Promise<void>((resolve) => {
      req.session.destroy((err) => {
        if (err) logger.error('Session destruction error:', err);
        resolve();
      });
    });

    return ServiceResponse.success('Session destroyed successfully', null);
  } catch (error) {
    logger.error('Error destroying session:', error);
    return ServiceResponse.failure('Failed to destroy session', null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const authService = {
  signUp,
  getSession,
  authenticateUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  signOut,
  sendVerificationEmail,
  createSession,
  destroySession,
};

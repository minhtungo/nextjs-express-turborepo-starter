import { verifyPassword } from '@api/common/lib/password';
import { handleServiceError } from '@api/common/lib/utils';
import { ServiceResponse } from '@api/common/models/serviceResponse';
import UserRepository from '@api/modules/user/userRepository';
import { db } from '@repo/database';
import type { ChangeUserPassword, UpdateUser } from '@repo/validation/user';
import { StatusCodes } from 'http-status-codes';

const updateUser = async (userId: string, data: UpdateUser, trx: typeof db = db) => {
  try {
    const user = await UserRepository.updateUser(userId, data, trx);

    return ServiceResponse.success(
      'User updated',
      {
        id: user.id,
      },
      StatusCodes.OK
    );
  } catch (error) {
    return handleServiceError(error as Error, 'Updating user');
  }
};

const changePassword = async (userId: string, data: ChangeUserPassword) => {
  try {
    const existingUser = await UserRepository.getUserById(userId);

    if (!existingUser) {
      return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
    }

    if (!existingUser.password) {
      return ServiceResponse.failure('Something went wrong', null, StatusCodes.NOT_FOUND);
    }

    const { currentPassword, newPassword } = data;

    const isValidPassword = await verifyPassword(existingUser.password, currentPassword);

    if (!isValidPassword) {
      return ServiceResponse.failure('Invalid password', null, StatusCodes.UNAUTHORIZED);
    }

    await UserRepository.updatePassword({ userId, newPassword });

    return ServiceResponse.success('Password changed successfully', null, StatusCodes.OK);
  } catch (error) {
    return handleServiceError(error as Error, 'Changing password');
  }
};

export const userService = {
  updateUser,
  changePassword,
};

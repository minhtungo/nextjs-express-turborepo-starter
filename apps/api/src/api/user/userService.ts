import { userRepository } from '@/api/user/userRepository';
import { verifyPassword } from '@/common/lib/password';
import { handleServiceError } from '@/common/lib/utils';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { db } from '@repo/database';
import { ChangeUserPassword, UpdateUser } from '@repo/types/user';
import { StatusCodes } from 'http-status-codes';

const updateUser = async (userId: string, data: UpdateUser, trx: typeof db = db) => {
  try {
    const user = await userRepository.updateUser(userId, data, trx);

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
    const existingUser = await userRepository.getUserById(userId);

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

    await userRepository.updatePassword({ userId, newPassword });

    return ServiceResponse.success('Password changed successfully', null, StatusCodes.OK);
  } catch (error) {
    return handleServiceError(error as Error, 'Changing password');
  }
};

export const userService = {
  updateUser,
  changePassword,
};

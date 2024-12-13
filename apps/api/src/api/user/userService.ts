import { userRepository } from '@/api/user/userRepository';
import { handleServiceError } from '@/common/lib/utils';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { db } from '@repo/database';
import { UpdateUser } from '@repo/types/user';
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

export const userService = {
  updateUser,
};

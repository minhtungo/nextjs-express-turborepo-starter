import { apiRoutes } from '@/config';
import { api } from '@/lib/api';
import { commonValidations } from '@/lib/validation';
import { UserDTO } from '@/types/dto/user';
import { ApiResponse } from '@repo/types';
import { ChangeUserPassword, UpdateUser } from '@repo/types/user';
import { z } from 'zod';

export const getUserInfoService = async (): Promise<UserDTO> => {
  const result = await api.get<UserDTO>(apiRoutes.user.getUserInfo);

  return result.data;
};

export const updateUserService = async (data: UpdateUser): Promise<ApiResponse> => {
  const result = await api.patch<UserDTO>(apiRoutes.user.updateUser, {
    body: data,
  });

  return result;
};

export const changeUserPasswordService = async (data: ChangeUserPassword): Promise<ApiResponse> => {
  const result = await api.patch<UserDTO>(apiRoutes.user.changePassword, {
    body: data,
  });

  return result;
};

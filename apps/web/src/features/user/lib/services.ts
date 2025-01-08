import { apiClient } from '@/lib/api';
import { apiRoutes } from '@/lib/config';
import type { UserDTO } from '@/types/dto/user';
import type { ApiResponse } from '@repo/validation/api';
import type { ChangeUserPassword, UpdateUser } from '@repo/validation/user';

export const getUserInfoService = async (): Promise<UserDTO> => {
  const result = await apiClient.get<UserDTO>(apiRoutes.user.getCurrentUser);

  return result.data;
};

export const updateUserService = async (data: UpdateUser): Promise<ApiResponse> => {
  const result = await apiClient.patch<UserDTO>(apiRoutes.user.updateUser, {
    body: data,
  });

  return result;
};

export const changeUserPasswordService = async (data: ChangeUserPassword): Promise<ApiResponse> => {
  const result = await apiClient.patch<UserDTO>(apiRoutes.user.changePassword, {
    body: data,
  });

  return result;
};

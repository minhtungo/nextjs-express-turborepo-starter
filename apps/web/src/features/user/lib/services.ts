import { api } from '@/lib/api';
import { apiRoutes } from '@/lib/config';
import type { UserDTO } from '@/types/dto/user';
import type { ApiResponse } from '@repo/validation/api';
import type { ChangeUserPassword, UpdateUser } from '@repo/validation/user';

export const getUserInfoService = async (): Promise<UserDTO> => {
  const result = await api.get<UserDTO>(apiRoutes.user.getCurrentUser);

  return result.data;
};

export const updateUserService = async (data: UpdateUser): Promise<ApiResponse<UserDTO>> => {
  const result = await api.patch<UserDTO>(apiRoutes.user.updateUser, data);

  return result;
};

export const changeUserPasswordService = async (data: ChangeUserPassword): Promise<ApiResponse> => {
  const result = await api.patch<UserDTO>(apiRoutes.user.changePassword, data);

  return result;
};

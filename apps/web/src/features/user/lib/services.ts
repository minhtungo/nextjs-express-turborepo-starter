import { apiRoutes } from '@/config';
import { api } from '@/lib/api/baseFetch';
import { UserDTO } from '@/types/dto/user';

export const getUserInfoService = async (): Promise<UserDTO> => {
  const result = await api.post<UserDTO>(apiRoutes.user.getUserInfo);

  return result;
};

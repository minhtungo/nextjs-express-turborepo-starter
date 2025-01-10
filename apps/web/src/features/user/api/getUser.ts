import { api } from '@/lib/api';
import { apiRoutes } from '@/lib/config';
import { UserDTO } from '@/types/dto/user';

export const getUser = async (): Promise<UserDTO> => {
  const result = await api.get<UserDTO>(apiRoutes.user.getCurrentUser);

  return result.data;
};

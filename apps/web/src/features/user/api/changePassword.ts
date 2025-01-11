import { api } from '@/lib/api';
import { apiPaths } from '@/config/paths';
import { MutationConfig } from '@/lib/react-query';
import { UserDTO } from '@/types/dto/user';
import { ApiResponse } from '@repo/validation/api';
import { ChangeUserPassword } from '@repo/validation/user';
import { useMutation } from '@tanstack/react-query';

export const changePassword = async (data: ChangeUserPassword): Promise<ApiResponse> => {
  return await api.patch<UserDTO>(apiPaths.user.changePassword, data);
};

type UseChangePasswordOptions = {
  mutationConfig?: MutationConfig<typeof changePassword>;
};

export const useChangePassword = ({ mutationConfig }: UseChangePasswordOptions = {}) => {
  return useMutation({
    mutationFn: changePassword,
    ...mutationConfig,
  });
};

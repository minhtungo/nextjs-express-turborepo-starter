import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { ReactQueryOptions, trpc } from '@/trpc/client';
import { UserDTO } from '@/types/dto/user';
import { ApiResponse } from '@repo/validation/api';
import { ChangeUserPassword } from '@repo/validation/user';

export const changePassword = async (data: ChangeUserPassword): Promise<ApiResponse> => {
  return await api.patch<UserDTO>(apiPaths.user.changePassword, data);
};

type ChangePasswordOptions = ReactQueryOptions['user']['changePassword'];

export const useChangePassword = (options?: ChangePasswordOptions) => {
  const utils = trpc.useUtils();

  return trpc.user.changePassword.useMutation({
    ...options,
    onSuccess(data, variables, context) {
      utils.user.me.invalidate();
      options?.onSuccess?.(data, variables, context);
    },
  });
};

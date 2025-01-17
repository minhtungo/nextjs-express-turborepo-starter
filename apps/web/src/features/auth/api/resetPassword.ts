import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { trpc } from '@/trpc/client';
import { ApiResponse } from '@repo/validation/api';
import { resetPasswordProps } from '@repo/validation/auth';

export const resetPassword = async (values: resetPasswordProps): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.resetPassword, values);

  return response;
};

export const useResetPassword = ({ onSuccess }: { onSuccess?: () => void }) => {
  return trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

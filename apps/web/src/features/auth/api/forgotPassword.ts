import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { trpc } from '@/trpc/client';
import { ApiResponse } from '@repo/validation/api';
import { forgotPasswordProps } from '@repo/validation/auth';

export const forgotPassword = async (values: forgotPasswordProps): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.forgotPassword, values);

  return response;
};

export const useForgotPassword = ({ onSuccess }: { onSuccess?: () => void }) => {
  return trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

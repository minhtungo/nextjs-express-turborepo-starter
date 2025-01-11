import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { ApiResponse } from '@repo/validation/api';
import { resetPasswordProps } from '@repo/validation/auth';
import { useMutation } from '@tanstack/react-query';

export const resetPassword = async (values: resetPasswordProps): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.resetPassword, values);

  return response;
};

export const useResetPassword = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

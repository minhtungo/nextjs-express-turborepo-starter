import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { ApiResponse } from '@repo/validation/api';
import { forgotPasswordProps } from '@repo/validation/auth';
import { useMutation } from '@tanstack/react-query';

export const forgotPassword = async (values: forgotPasswordProps): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.forgotPassword, values);

  return response;
};

export const useForgotPassword = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

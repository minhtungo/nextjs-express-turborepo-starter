import { api } from '@/lib/api';
import { apiPaths } from '@/config/paths';
import { ApiResponse } from '@repo/validation/api';
import { verifyEmailProps } from '@repo/validation/auth';
import { useMutation } from '@tanstack/react-query';

export const verifyEmail = async (values: verifyEmailProps): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.verifyEmail, values);

  return response;
};

export const useVerifyEmail = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

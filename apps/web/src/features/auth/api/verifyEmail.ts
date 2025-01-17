import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { trpc } from '@/trpc/client';
import { ApiResponse } from '@repo/validation/api';
import { verifyEmailProps } from '@repo/validation/auth';

export const verifyEmail = async (values: verifyEmailProps): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.verifyEmail, values);

  return response;
};

export const useVerifyEmail = ({ onSuccess }: { onSuccess?: () => void }) => {
  return trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

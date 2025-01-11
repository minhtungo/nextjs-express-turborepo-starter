import { api } from '@/lib/api';
import { apiPaths } from '@/config/paths';
import { ApiResponse } from '@repo/validation/api';
import { sendVerificationEmailProps } from '@repo/validation/auth';
import { useMutation } from '@tanstack/react-query';

export const sendVerificationEmail = async (values: sendVerificationEmailProps): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.sendVerificationEmail, values);

  return response;
};

export const useSendVerificationEmail = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: sendVerificationEmail,
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

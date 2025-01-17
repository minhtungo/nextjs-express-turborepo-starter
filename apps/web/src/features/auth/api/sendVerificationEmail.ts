import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { trpc } from '@/trpc/client';
import { ApiResponse } from '@repo/validation/api';
import { sendVerificationEmailProps } from '@repo/validation/auth';

export const sendVerificationEmail = async (values: sendVerificationEmailProps): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.sendVerificationEmail, values);

  return response;
};

export const useSendVerificationEmail = ({ onSuccess }: { onSuccess?: () => void }) => {
  return trpc.auth.sendVerificationEmail.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

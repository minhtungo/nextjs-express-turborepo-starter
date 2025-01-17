import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { trpc } from '@/trpc/client';
import { ApiResponse } from '@repo/validation/api';
import { signInProps, signUpSchema } from '@repo/validation/auth';
import { SessionUser } from '@repo/validation/user';
import { z } from 'zod';

export const signUpInputSchema = signUpSchema;

export type SignUpInput = z.infer<typeof signUpInputSchema>;

export const signUp = async (values: signInProps): Promise<ApiResponse<SessionUser>> => {
  const response = await api.post<SessionUser>(apiPaths.auth.signUp, values);

  return response;
};

export const useSignUp = ({ onSuccess }: { onSuccess?: () => void }) => {
  return trpc.auth.signUp.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

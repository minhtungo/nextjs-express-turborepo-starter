import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { userQueryKey } from '@/lib/auth';
import { ApiResponse } from '@repo/validation/api';
import { signInProps, signInSchema } from '@repo/validation/auth';
import { SessionUser } from '@repo/validation/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export const signInInputSchema = signInSchema;

export type SignInInput = z.infer<typeof signInInputSchema>;

export const signInWithEmailAndPassword = async (values: signInProps): Promise<ApiResponse<SessionUser>> => {
  const response = await api.post<SessionUser>(apiPaths.auth.signIn, values);

  return response;
};

export const useSignIn = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signInWithEmailAndPassword,
    onSuccess: (result) => {
      queryClient.setQueryData(userQueryKey, result.data);
      onSuccess?.();
    },
  });
};

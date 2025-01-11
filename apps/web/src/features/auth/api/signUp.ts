import { api } from '@/lib/api';
import { apiPaths } from '@/config/paths';
import { ApiResponse } from '@repo/validation/api';
import { signInProps, signUpSchema } from '@repo/validation/auth';
import { SessionUser } from '@repo/validation/user';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

export const signUpInputSchema = signUpSchema;

export type SignUpInput = z.infer<typeof signUpInputSchema>;

export const signUp = async (values: signInProps): Promise<ApiResponse<SessionUser>> => {
  const response = await api.post<SessionUser>(apiPaths.auth.signUp, values);

  return response;
};

export const useSignUp = ({ onSuccess }: { onSuccess?: () => void }) => {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signUp,
    onSuccess: (result) => {
      //   queryClient.setQueryData(userQueryKey, result.data);
      onSuccess?.();
    },
  });
};

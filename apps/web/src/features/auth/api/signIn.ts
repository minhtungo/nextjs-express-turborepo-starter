import { trpc } from '@/trpc/client';
import { signInSchema } from '@repo/validation/auth';
import { z } from 'zod';

export const signInInputSchema = signInSchema;

export type SignInInput = z.infer<typeof signInInputSchema>;

// export const signInWithEmailAndPassword = async (values: signInProps): Promise<ApiResponse<SessionUser>> => {
//   return await trpc.auth.signIn.mutate(values);
// };

export const useSignIn = ({ onSuccess }: { onSuccess?: () => void }) => {
  const utils = trpc.useUtils();
  return trpc.auth.signIn.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
      onSuccess?.();
    },
  });
};

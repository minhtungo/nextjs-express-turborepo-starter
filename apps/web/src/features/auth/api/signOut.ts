import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { trpc } from '@/trpc/client';
import { ApiResponse } from '@repo/validation/api';

export const signOut = async (): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.signOut);

  return response;
};

export const useSignOut = ({ onSuccess }: { onSuccess?: () => void }) => {
  const utils = trpc.useUtils();

  return trpc.auth.signOut.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
      onSuccess?.();
    },
  });
};

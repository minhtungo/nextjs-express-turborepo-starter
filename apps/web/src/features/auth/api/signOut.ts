import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { userQueryKey } from '@/lib/auth';
import { ApiResponse } from '@repo/validation/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const signOut = async (): Promise<ApiResponse> => {
  const response = await api.post(apiPaths.auth.signOut);

  return response;
};

export const useSignOut = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: userQueryKey,
      });
      onSuccess?.();
    },
  });
};

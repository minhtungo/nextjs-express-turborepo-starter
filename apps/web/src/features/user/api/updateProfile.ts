import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { useUser } from '@/lib/auth';
import { MutationConfig } from '@/lib/react-query';
import { ApiResponse } from '@repo/validation/api';
import { updateProfileSchema } from '@repo/validation/user';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

export const updateProfileInputSchema = updateProfileSchema;

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

export const updateProfile = async (
  data: UpdateProfileInput
): Promise<
  ApiResponse<{
    id: string;
  }>
> => {
  return await api.patch(apiPaths.user.updateProfile, data);
};

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ mutationConfig }: UseUpdateProfileOptions = {}) => {
  const { refetch: refetchUser } = useUser();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateProfile,
  });
};

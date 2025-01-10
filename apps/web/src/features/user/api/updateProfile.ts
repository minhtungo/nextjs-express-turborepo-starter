import { api } from '@/lib/api';
import { apiRoutes } from '@/lib/config';
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
  return await api.patch(apiRoutes.user.updateProfile, data);
};

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ mutationConfig }: UseUpdateProfileOptions = {}) => {
  return useMutation({
    mutationFn: updateProfile,
    ...mutationConfig,
  });
};

import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { ReactQueryOptions, trpc } from '@/trpc/client';
import { ApiResponse } from '@repo/validation/api';
import { updateProfileSchema } from '@repo/validation/user';
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

type UpdateProfiledOptions = ReactQueryOptions['user']['updateProfile'];

export const useUpdateProfile = (options?: UpdateProfiledOptions) => {
  const utils = trpc.useUtils();

  return trpc.user.updateProfile.useMutation({
    ...options,
    onSuccess(data, variables, context) {
      utils.user.me.invalidate();
      options?.onSuccess?.(data, variables, context);
    },
  });
};

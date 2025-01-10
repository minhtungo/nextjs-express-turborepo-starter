import { useUser } from '@/components/providers/AuthProvider';
import { useUpdateProfile } from '@/features/user/api/updateProfile';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@repo/ui/hooks/use-toast';
import { updateProfileSchema } from '@repo/validation/user';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useUpdateUserForm = () => {
  const { user } = useUser();
  const { mutate: updateUser, isPending, error, isSuccess } = useUpdateProfile();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      image: user?.image || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    updateUser(values, {
      onSuccess: () => {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });
      },
      onError: () => {
        toast({
          title: 'Failed to update profile',
          description: 'Please try again.',
        });
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending,
    error: error?.message,
    success: isSuccess ? 'Your profile has been successfully updated.' : null,
    user,
  };
};

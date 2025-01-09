import { useUser } from '@/components/providers/AuthProvider';
import { useUpdateUserMutation } from '@/features/user/api/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@repo/ui/hooks/use-toast';
import { updateUserSchema } from '@repo/validation/user';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useUpdateUserForm = () => {
  const { user } = useUser();
  const { mutate: updateUser, isPending, error, isSuccess } = useUpdateUserMutation();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      image: user?.image || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
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

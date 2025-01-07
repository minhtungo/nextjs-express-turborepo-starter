import { changeUserPasswordService, updateUserService } from '@/features/user/lib/services';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: updateUserService,
  });
};

export const useChangeUserPasswordMutation = () => {
  return useMutation({
    mutationFn: changeUserPasswordService,
  });
};

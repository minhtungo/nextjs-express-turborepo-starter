import { getCurrentUserService } from '@/features/auth/lib/services';
import { useQuery } from '@tanstack/react-query';

export const authKeys = {
  getCurrentUser: ['currentUser'],
} as const;

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.getCurrentUser,
    queryFn: getCurrentUserService,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

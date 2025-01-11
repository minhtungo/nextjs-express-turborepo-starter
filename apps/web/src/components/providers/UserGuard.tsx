import { userQueryKey } from '@/lib/auth';
import { ApiResponse } from '@repo/validation/api';
import { SessionUser } from '@repo/validation/user';
import { useQueryClient } from '@tanstack/react-query';
import React, { use, useEffect } from 'react';

interface UserGuardProps {
  children: React.ReactNode;
  userPromise: Promise<ApiResponse<SessionUser | null>>;
}

export const UserGuard = ({ children, userPromise }: UserGuardProps) => {
  const result = use(userPromise || null);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(userQueryKey, result.data);
  }, [result.data]);

  return <>{children}</>;
};

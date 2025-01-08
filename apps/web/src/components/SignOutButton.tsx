'use client';

import LoaderButton from '@/components/LoaderButton';
import { useSignOutMutation } from '@/features/auth/api/mutations';
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
  const router = useRouter();
  const { mutate: signOut, isPending } = useSignOutMutation();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <LoaderButton type="button" isPending={isPending} onClick={handleSignOut} size="sm">
      Sign out
    </LoaderButton>
  );
};

export default SignOutButton;

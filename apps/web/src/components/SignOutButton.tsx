'use client';

import LoaderButton from '@/components/LoaderButton';
import { useSignOut } from '@/features/auth/api/signOut';
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
  const router = useRouter();
  const { mutate: signOut, isPending } = useSignOut({
    onSuccess: () => {
      router.push('/');
    },
  });

  const handleSignOut = () => {
    signOut();
  };

  return (
    <LoaderButton type="button" isPending={isPending} onClick={handleSignOut} size="sm">
      Sign out
    </LoaderButton>
  );
};

export default SignOutButton;

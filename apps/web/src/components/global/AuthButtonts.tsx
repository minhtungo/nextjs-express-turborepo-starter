'use client';

import SignOutButton from '@/components/SignOutButton';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';
import Link from 'next/link';

const AuthButtons = () => {
  const { data: user } = useUser();

  return (
    <div className="flex items-center gap-x-2">
      {user ? <SignOutButton /> : <Link href={paths.auth.signIn.getHref()}>Sign In</Link>}
    </div>
  );
};

export default AuthButtons;

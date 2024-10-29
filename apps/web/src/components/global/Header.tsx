import SignOutButton from '@/components/global/SignOutButton';
import { Button } from '@/components/ui/button';
import { authRoutes } from '@/config';
import { signOutAction } from '@/features/auth/actions/auth';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Suspense } from 'react';

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <header className='h-14 p-4 border-b'>
      <div className='flex items-center justify-between'>
        <Link href='/dashboard'>Home</Link>
        <Suspense fallback={'Loading...'}>
          <AuthButtons />
        </Suspense>
      </div>
    </header>
  );
};

const AuthButtons = async () => {
  const user = await getCurrentUser();
  return (
    <div className='flex gap-x-2 items-center'>
      {user ? <SignOutButton /> : <Link href={authRoutes.signIn}>Sign In</Link>}
    </div>
  );
};

export default Header;

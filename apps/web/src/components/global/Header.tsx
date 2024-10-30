import SignOutButton from '@/components/SignOutButton';
import { authRoutes } from '@/config';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Suspense } from 'react';

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <header className='h-14 p-4 border-b'>
      <div className='flex items-center justify-between'>
        <Link href='/'>Home</Link>
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

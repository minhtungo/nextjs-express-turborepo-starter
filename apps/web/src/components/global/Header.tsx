import SignOutButton from '@/components/SignOutButton';
import ThemeToggle from '@/components/ThemeToggle';
import { authRoutes } from '@/config';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { Suspense } from 'react';

const Header = () => {
  return (
    <header className='h-14  border-b'>
      <div className='flex p-4 h-full w-full items-center justify-between'>
        <Link href='/'>Home</Link>
        <div className='flex gap-x-2 items-center'>
          <ThemeToggle />
          <Suspense fallback={'Loading...'}>
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

const AuthButtons = async () => {
  const session = await getSession();

  const user = session?.user;

  return (
    <div className='flex gap-x-2 items-center'>
      {user ? <SignOutButton /> : <Link href={authRoutes.signIn}>Sign In</Link>}
    </div>
  );
};

export default Header;

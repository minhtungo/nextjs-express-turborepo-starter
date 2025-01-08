import SignOutButton from '@/components/SignOutButton';
import ThemeToggle from '@/components/ThemeToggle';
import Container from '@/components/layout/Container';
import { authRoutes } from '@/lib/config';
import { getCurrentUser } from '@/lib/auth';
import { publicNavLinks } from '@/lib/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const PublicHeader = () => {
  return (
    <header className="h-14 border-b">
      <Container className="flex h-full w-full items-center gap-x-4 p-4">
        {publicNavLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-x-2">
          <ThemeToggle />
          <Suspense fallback={null}>
            <AuthButtons />
          </Suspense>
        </div>
      </Container>
    </header>
  );
};

const AuthButtons = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center gap-x-2">
      {user ? <SignOutButton /> : <Link href={authRoutes.signIn}>Sign In</Link>}
    </div>
  );
};

export default PublicHeader;

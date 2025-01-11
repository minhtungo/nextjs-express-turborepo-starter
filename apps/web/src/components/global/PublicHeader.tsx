import ThemeToggle from '@/components/ThemeToggle';
import AuthButtons from '@/components/global/AuthButtonts';
import Container from '@/components/layout/Container';
import { paths } from '@/config/paths';
import Link from 'next/link';
import { Suspense } from 'react';

const PublicHeader = () => {
  return (
    <header className="h-14 border-b">
      <Container className="flex h-full w-full items-center gap-x-4 p-4">
        {Object.values(paths.public).map((link) => (
          <Link key={link.getHref()} href={link.getHref()}>
            {link.getHref()}
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

export default PublicHeader;

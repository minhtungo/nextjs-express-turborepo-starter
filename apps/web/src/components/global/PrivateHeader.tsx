import Container from '@/components/layout/Container';
import SignOutButton from '@/components/SignOutButton';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

const PrivateHeader = () => {
  return (
    <header className="h-14 border-b">
      <Container className="flex p-4 h-full w-full items-center gap-x-8">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/settings">Settings</Link>
        <div className="flex gap-x-2 items-center ml-auto">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </Container>
    </header>
  );
};

export default PrivateHeader;

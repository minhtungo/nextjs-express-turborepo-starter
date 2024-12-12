import '@/assets/styles/globals.css';
import Header from '@/components/global/Header';
import Container from '@/components/layout/Container';
import Providers from '@/components/providers';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { validateRequest, verifySession } from '@/lib/auth';
import '@repo/ui/styles.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionPromise = validateRequest();

  return <AuthProvider sessionPromise={sessionPromise}>{children}</AuthProvider>;
}

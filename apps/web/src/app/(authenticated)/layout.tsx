import { AuthProvider } from '@/components/providers/AuthProvider';
import { getCurrentUser } from '@/lib/auth';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userPromise = getCurrentUser();

  return <AuthProvider userPromise={userPromise}>{children}</AuthProvider>;
}

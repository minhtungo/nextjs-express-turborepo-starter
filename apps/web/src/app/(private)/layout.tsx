import PrivateHeader from '@/components/global/PrivateHeader';
import Container from '@/components/layout/Container';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { getCurrentUser } from '@/lib/auth';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userPromise = getCurrentUser();

  return (
    <AuthProvider userPromise={userPromise}>
      <PrivateHeader />
      <Container tag="main" className="py-6">
        {children}
      </Container>
    </AuthProvider>
  );
}

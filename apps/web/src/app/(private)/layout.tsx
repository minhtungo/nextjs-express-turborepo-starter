import PrivateHeader from '@/components/global/PrivateHeader';
import Container from '@/components/layout/Container';
import { getUserQueryOptions } from '@/lib/auth';
import { Toaster } from '@repo/ui/toaster';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getUserQueryOptions());

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PrivateHeader />
      <Container tag="main" className="py-6">
        {children}
      </Container>
      <Toaster />
    </HydrationBoundary>
  );
}

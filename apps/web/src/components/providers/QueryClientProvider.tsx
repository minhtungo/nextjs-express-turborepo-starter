'use client';

import { queryConfig } from '@/lib/react-query';
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
}

'use client';
// ^-- to make sure we can mount the Provider from a server component
import { env } from '@/config/env';
import type { AppRouter } from '@repo/api';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact, inferReactQueryProcedureOptions } from '@trpc/react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;

let clientQueryClientSingleton: QueryClient;

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
};

const getUrl = () => {
  //   const base = (() => {
  //     if (typeof window !== 'undefined') return '';
  //     if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  //     return 'http://localhost:3000';
  //   })();
  const base = env.NEXT_PUBLIC_EXTERNAL_SERVER_URL;
  return `${base}/trpc`;
};

export const TRPCProvider = (
  props: Readonly<{
    children: React.ReactNode;
  }>
) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </trpc.Provider>
  );
};

import type { ReactNode } from 'react';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { queryClient } from '@/lib/query-client';
import { router } from '@/lib/router';

type AppProviderProps = {
  children: ReactNode;
};

export function QueryProvider({ children }: AppProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <QueryProvider>{children}</QueryProvider>
    </ChakraProvider>
  );
}

import type { DefaultOptions } from '@tanstack/react-query';

import { QueryClient } from '@tanstack/react-query';

const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export { queryClient };

import { createContext } from 'react';

import type { UserProfile } from '@/types/user';

export type UserContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

export const UserContext = createContext<UserContextValue | null>(null);

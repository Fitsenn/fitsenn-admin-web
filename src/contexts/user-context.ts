import { createContext, useContext } from 'react';

import type { UserProfile } from '@/types/user';

type UserContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { UserContext, useUser };
export type { UserContextValue };

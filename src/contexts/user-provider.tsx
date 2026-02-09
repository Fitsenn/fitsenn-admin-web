import type { ReactNode } from 'react';

import { type UserContextValue, UserContext } from '@/contexts';
import { useUserProfile } from '@/api/get-user-profile';

type UserProviderProps = {
  children: ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const { data: user, isLoading, isError, refetch } = useUserProfile();

  const value: UserContextValue = {
    user: user ?? null,
    isLoading,
    isError,
    refetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserProvider };

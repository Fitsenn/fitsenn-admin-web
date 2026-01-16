import type { UserProfile } from '@/types/user';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session) {
    return null;
  }

  const userId = session.user.id;
  const email = session.user.email ?? '';

  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, phone')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return {
    ...data,
    email,
  };
};

export const userProfileQueryOptions = () => {
  return queryOptions({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
  });
};

export const useUserProfile = () => {
  return useQuery(userProfileQueryOptions());
};

import type { DatabaseUserProfile, UserProfile } from '@/types/user';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';

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
    ...transformers.fromDatabase(data as DatabaseUserProfile),
    email,
  };
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
  });
};

import type { DatabaseUserProfile, UserProfile } from '@/types/user';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';

export type UpdateProfileParams = {
  firstName: string;
  lastName: string;
  phone: string;
};

const updateProfile = async (params: UpdateProfileParams): Promise<UserProfile> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session) {
    throw new Error('Not authenticated');
  }

  const userId = session.user.id;
  const email = session.user.email ?? '';

  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: params.firstName,
      last_name: params.lastName,
      phone: params.phone,
    })
    .eq('id', userId)
    .select('id, first_name, last_name, avatar_url, phone')
    .single();

  if (error) {
    throw error;
  }

  return {
    ...transformers.fromDatabase(data as DatabaseUserProfile),
    email,
  };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['user', 'profile'], updatedProfile);
    },
  });
};

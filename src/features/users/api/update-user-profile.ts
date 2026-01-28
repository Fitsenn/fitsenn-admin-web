import type { UserProfile } from '@/types/user';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type UpdateUserProfileParams = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const updateUserProfile = async ({
  userId,
  firstName,
  lastName,
  email,
  phone,
}: UpdateUserProfileParams): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    })
    .eq('id', userId)
    .select('id, first_name, last_name, avatar_url, phone, email');

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('Profile not found or update not permitted');
  }

  return data[0] as UserProfile;
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-users'] });
    },
  });
};

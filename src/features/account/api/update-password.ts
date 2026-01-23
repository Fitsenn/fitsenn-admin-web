import { useMutation } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type UpdatePasswordParams = {
  currentPassword: string;
  newPassword: string;
};

const updatePassword = async (params: UpdatePasswordParams): Promise<void> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session || !session.user.email) {
    throw new Error('Not authenticated');
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: session.user.email,
    password: params.currentPassword,
  });

  if (signInError) {
    throw new Error('Current password is incorrect');
  }

  const { error } = await supabase.auth.updateUser({
    password: params.newPassword,
  });

  if (error) {
    throw error;
  }
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};

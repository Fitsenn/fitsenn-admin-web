import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const deleteAccount = async (): Promise<void> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session) {
    throw new Error('Not authenticated');
  }

  const userId = session.user.id;

  const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);

  if (profileError) {
    throw profileError;
  }

  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    throw signOutError;
  }
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

import type { AuthError } from '@supabase/supabase-js';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type LogoutResponse = {
  error: AuthError | null;
};

export const logout = async (): Promise<LogoutResponse> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

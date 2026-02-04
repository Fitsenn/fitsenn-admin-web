import type { InviteUserResult } from '../types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type InviteUserInput = {
  companyId: string;
  email: string;
};

const inviteUser = async ({ companyId, email }: InviteUserInput): Promise<InviteUserResult> => {
  const { data, error } = await supabase.rpc('invite_existing_user_to_company', {
    p_company_id: companyId,
    p_email: email,
  });

  if (error) {
    console.error('Error inviting user:', error);
    throw error;
  }

  return data as InviteUserResult;
};

export const useInviteUser = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteUser,
    onSuccess: (result) => {
      if (result.status === 'added') {
        queryClient.invalidateQueries({ queryKey: ['company', companyId, 'users'] });
      }
    },
  });
};

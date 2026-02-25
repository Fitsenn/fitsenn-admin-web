import type { TablesUpdate } from '@/types/database.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type UpdateUserMembershipInput = {
  membershipId: string;
  userId: string;
  companyId: string;
  data: TablesUpdate<'user_memberships'>;
};

const updateUserMembership = async ({ membershipId, data }: UpdateUserMembershipInput) => {
  const { data: result, error } = await supabase
    .from('user_memberships')
    .update(data)
    .eq('id', membershipId)
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const useUpdateUserMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserMembership,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-memberships', variables.userId, variables.companyId],
      });
    },
  });
};

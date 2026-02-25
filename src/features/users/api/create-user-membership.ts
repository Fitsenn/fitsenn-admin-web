import type { TablesInsert } from '@/types/database.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type CreateUserMembershipInput = TablesInsert<'user_memberships'>;

const createUserMembership = async (input: CreateUserMembershipInput) => {
  const { data, error } = await supabase
    .from('user_memberships')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useCreateUserMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserMembership,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-memberships', variables.user_id, variables.company_id],
      });
    },
  });
};

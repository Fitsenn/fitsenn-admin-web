import type { TablesInsert } from '@/types/database.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type CreateMembershipPenaltyInput = TablesInsert<'membership_plan_penalties'>;

const createMembershipPenalty = async (input: CreateMembershipPenaltyInput) => {
  const { data, error } = await supabase
    .from('membership_plan_penalties')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useCreateMembershipPenalty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMembershipPenalty,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['membership-penalties', variables.company_id],
      });
    },
  });
};

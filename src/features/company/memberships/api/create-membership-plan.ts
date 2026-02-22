import type { TablesInsert } from '@/types/database.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type CreateMembershipPlanInput = TablesInsert<'membership_plans'>;

const createMembershipPlan = async (input: CreateMembershipPlanInput) => {
  const { data, error } = await supabase
    .from('membership_plans')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useCreateMembershipPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMembershipPlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['membership-plans', variables.company_id],
      });
    },
  });
};

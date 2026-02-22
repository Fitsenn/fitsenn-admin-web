import type { TablesUpdate } from '@/types/database.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type UpdateMembershipPlanInput = {
  planId: string;
  data: TablesUpdate<'membership_plans'>;
};

const updateMembershipPlan = async ({ planId, data }: UpdateMembershipPlanInput) => {
  const { data: plan, error } = await supabase
    .from('membership_plans')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', planId)
    .select()
    .single();

  if (error) throw error;
  return plan;
};

export const useUpdateMembershipPlan = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['membership-plans', companyId],
      });
    },
  });
};

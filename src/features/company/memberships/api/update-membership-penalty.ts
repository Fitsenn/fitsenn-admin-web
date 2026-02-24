import type { TablesUpdate } from '@/types/database.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type UpdateMembershipPenaltyInput = {
  penaltyId: string;
  data: TablesUpdate<'membership_plan_penalties'>;
};

const updateMembershipPenalty = async ({ penaltyId, data }: UpdateMembershipPenaltyInput) => {
  const { data: penalty, error } = await supabase
    .from('membership_plan_penalties')
    .update(data)
    .eq('id', penaltyId)
    .select()
    .single();

  if (error) throw error;
  return penalty;
};

export const useUpdateMembershipPenalty = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMembershipPenalty,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['membership-penalties', companyId],
      });
    },
  });
};

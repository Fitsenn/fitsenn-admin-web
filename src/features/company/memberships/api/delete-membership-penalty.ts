import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const deleteMembershipPenalty = async (penaltyId: string): Promise<void> => {
  const { error } = await supabase
    .from('membership_plan_penalties')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', penaltyId);

  if (error) throw error;
};

export const useDeleteMembershipPenalty = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMembershipPenalty,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['membership-penalties', companyId],
      });
    },
  });
};

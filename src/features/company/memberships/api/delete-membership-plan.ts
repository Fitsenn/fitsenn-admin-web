import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const deleteMembershipPlan = async (planId: string): Promise<void> => {
  const { error } = await supabase
    .from('membership_plans')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', planId);

  if (error) throw error;
};

export const useDeleteMembershipPlan = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['membership-plans', companyId],
      });
    },
  });
};

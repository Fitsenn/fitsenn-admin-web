import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const deleteMembershipDiscount = async (discountId: string): Promise<void> => {
  const { error } = await supabase
    .from('membership_discounts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', discountId);

  if (error) throw error;
};

export const useDeleteMembershipDiscount = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMembershipDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['membership-discounts', companyId],
      });
    },
  });
};

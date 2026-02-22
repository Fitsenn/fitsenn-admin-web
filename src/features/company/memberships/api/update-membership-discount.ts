import type { TablesUpdate } from '@/types/database.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type UpdateMembershipDiscountInput = {
  discountId: string;
  data: TablesUpdate<'membership_discounts'>;
};

const updateMembershipDiscount = async ({ discountId, data }: UpdateMembershipDiscountInput) => {
  const { data: discount, error } = await supabase
    .from('membership_discounts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', discountId)
    .select()
    .single();

  if (error) throw error;
  return discount;
};

export const useUpdateMembershipDiscount = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMembershipDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['membership-discounts', companyId],
      });
    },
  });
};

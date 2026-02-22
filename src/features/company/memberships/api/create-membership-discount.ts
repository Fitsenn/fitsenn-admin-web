import type { TablesInsert } from '@/types/database.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type CreateMembershipDiscountInput = TablesInsert<'membership_discounts'>;

const createMembershipDiscount = async (input: CreateMembershipDiscountInput) => {
  const { data, error } = await supabase
    .from('membership_discounts')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useCreateMembershipDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMembershipDiscount,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['membership-discounts', variables.company_id],
      });
    },
  });
};

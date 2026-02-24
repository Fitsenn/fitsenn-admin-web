import type { DatabaseMembershipDiscount, MembershipDiscount } from '@/types/company';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';

const getMembershipDiscounts = async (companyId: string): Promise<MembershipDiscount[]> => {
  if (!companyId) return [];

  const { data, error } = await supabase
    .from('membership_discounts')
    .select('*')
    .eq('company_id', companyId)
    .is('deleted_at', null);

  if (error) throw error;

  return transformers.fromDatabase((data ?? []) as DatabaseMembershipDiscount[]);
};

export const useMembershipDiscounts = (companyId: string) => {
  return useQuery({
    queryKey: ['membership-discounts', companyId],
    queryFn: () => getMembershipDiscounts(companyId),
    enabled: !!companyId,
  });
};

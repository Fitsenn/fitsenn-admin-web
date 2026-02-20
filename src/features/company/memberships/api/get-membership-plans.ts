import type { DatabaseMembershipPlan, MembershipPlan } from '@/types/company';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';

const getMembershipPlans = async (companyId: string): Promise<MembershipPlan[]> => {
  if (!companyId) return [];

  const { data, error } = await supabase.rpc('get_company_membership_plans', {
    p_company_id: companyId,
  });

  if (error) throw error;

  return transformers.fromDatabase((data ?? []) as DatabaseMembershipPlan[]);
};

export const useMembershipPlans = (companyId: string) => {
  return useQuery({
    queryKey: ['membership-plans', companyId],
    queryFn: () => getMembershipPlans(companyId),
    enabled: !!companyId,
  });
};

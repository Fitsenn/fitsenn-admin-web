import type { DatabaseMembershipPlanPenalty, MembershipPlanPenalty } from '@/types/company';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';

const getMembershipPenalties = async (companyId: string): Promise<MembershipPlanPenalty[]> => {
if (!companyId) return [];

  const { data, error } = await supabase
    .from('membership_plan_penalties')
    .select('*')
    .eq('company_id', companyId)
    .is('deleted_at', null);

  if (error) throw error;

  return transformers.fromDatabase((data ?? []) as DatabaseMembershipPlanPenalty[]);
};

export const useMembershipPenalties = (companyId: string) => {
  return useQuery({
    queryKey: ['membership-penalties', companyId],
    queryFn: () => getMembershipPenalties(companyId),
    enabled: !!companyId,
  });
};

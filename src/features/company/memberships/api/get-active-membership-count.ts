import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const getActiveMembershipCount = async (planId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('user_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('plan_id', planId)
    .gt('ends_at', new Date().toISOString());

  if (error) throw error;
  return count ?? 0;
};

export const useActiveMembershipCount = (planId: string, enabled = true) => {
  return useQuery({
    queryKey: ['membership-plans', planId, 'active-count'],
    queryFn: () => getActiveMembershipCount(planId),
    enabled: enabled && !!planId,
  });
};

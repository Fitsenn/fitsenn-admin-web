import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type DashboardStats = {
  totalUsers: number;
  activeMemberships: number;
  revenue: number;
};

const MEMBER_ROLE_ID = '00000000-0000-0000-0000-000000000002';

const getDashboardStats = async (companyId: string): Promise<DashboardStats> => {
  const now = new Date().toISOString();

  const [usersResult, membershipsResult] = await Promise.all([
    supabase
      .from('company_users')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .contains('roles', [MEMBER_ROLE_ID]),

    supabase
      .from('user_memberships')
      .select('price_paid, starts_at, ends_at')
      .eq('company_id', companyId),
  ]);

  if (usersResult.error) throw usersResult.error;
  if (membershipsResult.error) throw membershipsResult.error;

  const memberships = membershipsResult.data ?? [];

  const activeMemberships = memberships.filter(
    (m) => m.starts_at <= now && m.ends_at > now,
  ).length;

  const revenue = memberships.reduce((sum, row) => sum + Number(row.price_paid), 0);

  return {
    totalUsers: usersResult.count ?? 0,
    activeMemberships,
    revenue,
  };
};

export const useDashboardStats = (companyId: string) => {
  return useQuery({
    queryKey: ['dashboard-stats', companyId],
    queryFn: () => getDashboardStats(companyId),
    enabled: !!companyId,
  });
};

import type { Tables } from '@/types/database.types';
import type { SnakeToCamel } from '@/types/utility-types';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';

type DatabaseUserMembershipWithPlan = Tables<'user_memberships'> & {
  membership_plans: Tables<'membership_plans'>;
};

export type UserMembershipWithPlan = SnakeToCamel<DatabaseUserMembershipWithPlan>;

type GetUserMembershipsParams = {
  userId: string;
  companyId: string;
};

const getUserMemberships = async ({
  userId,
  companyId,
}: GetUserMembershipsParams): Promise<UserMembershipWithPlan[]> => {
  const { data, error } = await supabase
    .from('user_memberships')
    .select('*, membership_plans(*)')
    .eq('user_id', userId)
    .eq('company_id', companyId)
    .order('ends_at', { ascending: false })
    .order('starts_at', { ascending: false });

  if (error) throw error;

  return transformers.fromDatabase(
    data as unknown as DatabaseUserMembershipWithPlan[],
  );
};

export const useUserMemberships = ({ userId, companyId }: GetUserMembershipsParams) => {
  return useQuery({
    queryKey: ['user-memberships', userId, companyId],
    queryFn: () => getUserMemberships({ userId, companyId }),
    enabled: !!userId && !!companyId,
  });
};

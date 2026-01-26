import type { UserProfile } from '@/types/user';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type CompanyMemberResult = {
  user_id: string;
  profile: UserProfile;
  membership: unknown;
}[];

const getCompanyMembers = async (companyId: string): Promise<CompanyMemberResult> => {
  const { data, error } = await supabase.rpc('get_company_members', {
    company_id: companyId,
  });

  if (error) {
    throw error;
  }

  return data as CompanyMemberResult;
};

const getCompanyMembersQueryOptions = (companyId: string) => {
  return queryOptions({
    queryKey: ['company-members', companyId],
    queryFn: () => getCompanyMembers(companyId),
  });
};

export const useCompanyMembers = ({ companyId }: { companyId: string }) => {
  return useQuery(getCompanyMembersQueryOptions(companyId));
};

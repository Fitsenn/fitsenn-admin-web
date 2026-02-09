import type { UserProfile } from '@/types/user';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';
import type { SnakeToCamel } from '@/types/utility-types';

type DatabaseCompanyUser = {
  user_id: string;
  profile: UserProfile;
  membership: unknown;
};

type CompanyUser = SnakeToCamel<DatabaseCompanyUser>;

type CompanyUserResult = CompanyUser[];

export const HARDCODED_COMPANY_ID = 'dcd1db1e-7753-4ca6-ac7e-4c7e95a43bc7';

const getCompanyUsers = async (companyId: string): Promise<CompanyUserResult> => {
  const { data, error } = await supabase.rpc('get_company_members', {
    company_id: companyId,
  });

  if (error) {
    throw error;
  }

  return transformers.fromDatabase(data as unknown as DatabaseCompanyUser[]);
};

const getCompanyUsersQueryOptions = (companyId: string) => {
  return queryOptions({
    queryKey: ['company-users', companyId],
    queryFn: () => getCompanyUsers(companyId),
  });
};

export const useCompanyUsers = ({ companyId }: { companyId: string }) => {
  return useQuery(getCompanyUsersQueryOptions(companyId));
};

export const useCompanyUser = ({ companyId, userId }: { companyId: string; userId: string }) => {
  return useQuery({
    ...getCompanyUsersQueryOptions(companyId),
    select: (data) => data.find((user) => user.userId === userId),
  });
};

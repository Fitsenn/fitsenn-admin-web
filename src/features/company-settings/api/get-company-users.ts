import type { CompanyUser } from '../types';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const getCompanyUsers = async (companyId: string): Promise<CompanyUser[]> => {
  if (!companyId) return [];

  const { data, error } = await supabase.rpc('get_company_users', {
    p_company_id: companyId,
  });

  if (error) {
    console.error('Error fetching company users:', error);
    throw error;
  }

  return (data ?? []) as CompanyUser[];
};

export const companyUsersQueryOptions = (companyId: string) => {
  return queryOptions({
    queryKey: ['company', companyId, 'users'],
    queryFn: () => getCompanyUsers(companyId),
    enabled: !!companyId,
  });
};

export const useCompanyUsers = (companyId: string) => {
  return useQuery(companyUsersQueryOptions(companyId));
};

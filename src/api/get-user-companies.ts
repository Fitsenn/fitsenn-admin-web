import type { Company } from '@/types/company';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const getUserCompanies = async (): Promise<Company[]> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session) {
    return [];
  }

  const { data, error } = await supabase.rpc('get_user_companies');

  if (error) {
    console.error('Error fetching user companies:', error);
    throw error;
  }

  return data as Company[];
};

export const userCompaniesQueryOptions = () => {
  return queryOptions({
    queryKey: ['user', 'companies'],
    queryFn: getUserCompanies,
  });
};

export const useUserCompanies = () => {
  return useQuery(userCompaniesQueryOptions());
};

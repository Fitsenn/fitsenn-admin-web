import type { Company, DatabaseCompany } from '@/types/company';

import { useSuspenseQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';

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

  return transformers.fromDatabase(data as DatabaseCompany[]);
};

export const useUserCompanies = () => {
  return useSuspenseQuery({
    queryKey: ['user', 'companies'],
    queryFn: getUserCompanies,
  });
};

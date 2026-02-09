import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';
import type { SnakeToCamel } from '@/types/utility-types';

type DatabaseCompanySettings = {
  id: string;
  name: string;
  code: string;
  logo_url: string | null;
};

type CompanySettings = SnakeToCamel<DatabaseCompanySettings>;

const getCompanySettings = async (companyId: string): Promise<CompanySettings> => {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, code, logo_url')
    .eq('id', companyId)
    .single();

  if (error) {
    console.error('Error fetching company settings:', error);
    throw error;
  }

  return transformers.fromDatabase(data as DatabaseCompanySettings);
};

export const companySettingsQueryOptions = (companyId: string) => {
  return queryOptions({
    queryKey: ['company', companyId, 'settings'],
    queryFn: () => getCompanySettings(companyId),
    enabled: !!companyId,
  });
};

export const useCompanySettings = (companyId: string) => {
  return useQuery(companySettingsQueryOptions(companyId));
};

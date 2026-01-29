import type { CompanySettings } from '../types';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

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

  return data as CompanySettings;
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

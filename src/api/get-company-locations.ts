import type { DatabaseLocation, Location } from '@/types/location';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';

type GetCompanyLocationsOptions = {
  companyId: string;
  /** Filter to only return active locations (default: true) */
  activeOnly?: boolean;
};

const getCompanyLocations = async ({
  companyId,
  activeOnly = false,
}: GetCompanyLocationsOptions): Promise<Location[]> => {
  if (!companyId) {
    return [];
  }

  const { data, error } = await supabase.rpc('get_company_locations', {
    p_company_id: companyId,
    p_active_only: activeOnly,
  });

  if (error) {
    console.error('Error fetching company locations:', error);
    throw error;
  }

  return transformers.fromDatabase(data as DatabaseLocation[]);
};

export const companyLocationsQueryOptions = ({
  companyId,
  activeOnly = false,
}: GetCompanyLocationsOptions) => {
  return queryOptions({
    queryKey: ['company', companyId, 'locations', { activeOnly }],
    queryFn: () => getCompanyLocations({ companyId, activeOnly }),
    enabled: !!companyId,
  });
};

export const useCompanyLocations = (options: GetCompanyLocationsOptions) => {
  return useQuery(companyLocationsQueryOptions(options));
};

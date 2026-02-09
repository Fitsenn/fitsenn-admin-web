import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { transformers } from '@/utils/data-transformers';
import type { SnakeToCamel } from '@/types/utility-types';

export type DatabaseLocationDependencies = {
  has_active_plans: boolean;
  active_plans_count: number;
  has_active_memberships: boolean;
  active_memberships_count: number;
};

export type LocationDependencies = SnakeToCamel<DatabaseLocationDependencies>;

const checkLocationDependencies = async (locationId: string): Promise<LocationDependencies | null> => {
  const { data, error } = await supabase.rpc('check_location_dependencies', {
    p_location_id: locationId,
  });

  if (error) {
    console.error('Error checking location dependencies:', error);
    throw error;
  }

  if (data && data.length > 0) {
    return transformers.fromDatabase(data[0] as DatabaseLocationDependencies);
  }

  return null;
};

export const locationDependenciesQueryOptions = (locationId: string) =>
  queryOptions({
    queryKey: ['location', locationId, 'dependencies'],
    queryFn: () => checkLocationDependencies(locationId),
    enabled: !!locationId,
  });

export const useLocationDependencies = (locationId: string, enabled = true) =>
  useQuery({
    ...locationDependenciesQueryOptions(locationId),
    enabled: enabled && !!locationId,
  });

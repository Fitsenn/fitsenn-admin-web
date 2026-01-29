import { queryOptions, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type LocationDependencies = {
  has_active_plans: boolean;
  active_plans_count: number;
  has_active_memberships: boolean;
  active_memberships_count: number;
};

const checkLocationDependencies = async (locationId: string): Promise<LocationDependencies | null> => {
  const { data, error } = await supabase.rpc('check_location_dependencies', {
    p_location_id: locationId,
  });

  if (error) {
    console.error('Error checking location dependencies:', error);
    throw error;
  }

  if (data && data.length > 0) {
    return data[0] as LocationDependencies;
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

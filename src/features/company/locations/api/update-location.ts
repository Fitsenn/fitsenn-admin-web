import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type UpdateLocationInput = {
  locationId: string;
  name: string;
  address?: string | null;
  tier?: string | null;
  isActive?: boolean;
  operatingHours?: import('@/types/location').OperatingHours | null;
};

const updateLocation = async (input: UpdateLocationInput): Promise<boolean> => {
  const { data, error } = await supabase.rpc('update_location', {
    p_location_id: input.locationId,
    p_name: input.name,
    p_address: input.address ?? null,
    p_tier: input.tier ?? null,
    p_is_active: input.isActive ?? true,
    p_operating_hours: input.operatingHours ?? null,
  });

  if (error) {
    console.error('Error updating location:', error);
    throw error;
  }

  return data as boolean;
};

export const useUpdateLocation = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', companyId, 'locations'] });
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type UpdateLocationInput = {
  location_id: string;
  name: string;
  address?: string | null;
  tier?: string | null;
  is_active?: boolean;
  operating_hours?: import('@/types/location').OperatingHours | null;
};

const updateLocation = async (input: UpdateLocationInput): Promise<boolean> => {
  const { data, error } = await supabase.rpc('update_location', {
    p_location_id: input.location_id,
    p_name: input.name,
    p_address: input.address ?? null,
    p_tier: input.tier ?? null,
    p_is_active: input.is_active ?? true,
    p_operating_hours: input.operating_hours ?? null,
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

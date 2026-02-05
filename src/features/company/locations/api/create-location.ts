import type { OperatingHours } from '@/types/location';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type CreateLocationInput = {
  companyId: string;
  name: string;
  address?: string | null;
  tier?: string | null;
  isActive?: boolean;
  operatingHours?: OperatingHours | null;
};

const createLocation = async (input: CreateLocationInput): Promise<string> => {
  const { data, error} = await supabase.rpc('create_location', {
    p_company_id: input.companyId,
    p_name: input.name,
    p_address: input.address ?? null,
    p_tier: input.tier ?? null,
    p_is_active: input.isActive ?? true,
    p_operating_hours: input.operatingHours ?? null,
  });

  if (error) {
    console.error('Error creating location:', error);
    throw error;
  }

  return data;
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLocation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company', variables.companyId, 'locations'] });
    },
  });
};

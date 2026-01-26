import type { CreateLocationInput } from '../types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const createLocation = async (input: CreateLocationInput): Promise<string> => {
  const { data, error } = await supabase.rpc('create_location', {
    p_company_id: input.company_id,
    p_name: input.name,
    p_address: input.address ?? null,
    p_tier: input.tier ?? null,
    p_is_active: input.is_active ?? true,
    p_operating_hours: input.operating_hours ?? null,
  });

  if (error) {
    console.error('Error creating location:', error);
    throw error;
  }

  return data as string;
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLocation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company', variables.company_id, 'locations'] });
    },
  });
};

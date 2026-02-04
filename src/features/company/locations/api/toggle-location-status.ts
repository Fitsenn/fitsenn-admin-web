import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type ToggleLocationStatusInput = {
  locationId: string;
  isActive: boolean;
};

const toggleLocationStatus = async ({ locationId, isActive }: ToggleLocationStatusInput): Promise<boolean> => {
  const { data, error } = await supabase.rpc('toggle_location_status', {
    p_location_id: locationId,
    p_is_active: isActive,
  });

  if (error) {
    console.error('Error toggling location status:', error);
    throw error;
  }

  return data as boolean;
};

export const useToggleLocationStatus = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLocationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', companyId, 'locations'] });
    },
  });
};

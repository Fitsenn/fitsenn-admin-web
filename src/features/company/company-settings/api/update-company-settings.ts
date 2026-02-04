import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type UpdateCompanySettingsInput = {
  companyId: string;
  name: string;
  code: string;
  logoUrl?: string | null;
};

const updateCompanySettings = async (input: UpdateCompanySettingsInput): Promise<boolean> => {
  const { data, error } = await supabase.rpc('update_company_settings', {
    p_company_id: input.companyId,
    p_name: input.name,
    p_code: input.code,
    p_logo_url: input.logoUrl,
  });

  if (error) {
    console.error('Error updating company settings:', error);
    throw error;
  }

  return data as boolean;
};

export const useUpdateCompanySettings = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', companyId, 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'companies'] });
    },
  });
};

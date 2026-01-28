import { supabase } from '@/lib/supabase';

export const checkCompanyCodeAvailable = async (
  code: string,
  excludeCompanyId?: string,
): Promise<boolean> => {
  const { data, error } = await supabase.rpc('check_company_code_available', {
    p_code: code,
    p_exclude_company_id: excludeCompanyId ?? null,
  });

  if (error) {
    console.error('Error checking company code:', error);
    throw error;
  }

  return data as boolean;
};

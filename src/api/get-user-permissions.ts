import type { Permission } from '@/types/permissions';

import { useSuspenseQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const getUserPermissions = async (companyId: string): Promise<Permission[]> => {
  const { data, error } = await supabase.rpc('get_user_permissions', {
    p_company_id: companyId,
  });

  if (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }

  const permissions = (data as { permissions: string[] })?.permissions ?? [];
  return permissions as Permission[];
};

export const useUserPermissions = (companyId: string) => {
  return useSuspenseQuery({
    queryKey: ['company', companyId, 'permissions'],
    queryFn: () => getUserPermissions(companyId),
  });
};

import { type ReactNode, useCallback, useMemo } from 'react';

import { useUserPermissions } from '@/api/get-user-permissions';
import { useCompany } from '@/contexts/company-context';
import { type PermissionsContextValue, PermissionsContext } from '@/contexts/permissions-context';
import type { ActionForResource, HasPermissionFn, Permission, Resource } from '@/types/permissions';

type PermissionsProviderProps = {
  children: ReactNode;
};

const PermissionsProvider = ({ children }: PermissionsProviderProps) => {
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: permissions } = useUserPermissions(companyId);

  const hasPermission: HasPermissionFn = useCallback(
    <R extends Resource>(resource: R, action: ActionForResource<R>): boolean => {
      const permissionString = `${resource}:${action}` as Permission;
      return permissions.includes(permissionString);
    },
    [permissions],
  );

  const value: PermissionsContextValue = useMemo(
    () => ({
      permissions,
      hasPermission,
    }),
    [permissions, hasPermission],
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
};

export { PermissionsProvider };

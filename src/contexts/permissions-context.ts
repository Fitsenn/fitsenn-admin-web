import type { HasPermissionFn, Permission } from '@/types/permissions';

import { createContext, useContext } from 'react';

type PermissionsContextValue = {
  permissions: Permission[];
  hasPermission: HasPermissionFn;
};

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

const usePermissions = () => {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }

  return context;
};

export { PermissionsContext, usePermissions };
export type { PermissionsContextValue };

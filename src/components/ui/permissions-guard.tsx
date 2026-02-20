import type { ReactNode } from 'react';

import type { FileRoutesByPath } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { usePermissions } from '@/contexts';
import type { ActionForResource, Resource } from '@/types/permissions';

type AppRoutePath = Exclude<FileRoutesByPath[keyof FileRoutesByPath]['fullPath'], ''>;

type PermissionsGuardProps<R extends Resource> = {
  resource: R;
  action: ActionForResource<R>;
  redirectTo: AppRoutePath;
  children: ReactNode;
};

const PermissionsGuard = <R extends Resource>({
  resource,
  action,
  redirectTo,
  children,
}: PermissionsGuardProps<R>) => {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  const isAllowed = hasPermission(resource, action);

  // Redirect when user lacks access
  useEffect(() => {
    if (!isAllowed) {
      navigate({ to: redirectTo });
    }
  }, [isAllowed, navigate, redirectTo]);

  if (!isAllowed) return null;

  return <>{children}</>;
};

export { PermissionsGuard };

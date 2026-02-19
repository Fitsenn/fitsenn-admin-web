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
  const { hasPermission, isLoading } = usePermissions();
  const navigate = useNavigate();

  const isAllowed = hasPermission(resource, action);

  // Redirect when permissions are loaded and user lacks access
  useEffect(() => {
    if (!isLoading && !isAllowed) {
      navigate({ to: redirectTo });
    }
  }, [isLoading, isAllowed, navigate, redirectTo]);

  if (isLoading || !isAllowed) return null;

  return <>{children}</>;
};

export { PermissionsGuard };

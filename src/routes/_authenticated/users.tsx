import { createFileRoute, Outlet } from '@tanstack/react-router';

import { PermissionsGuard } from '@/components/ui/permissions-guard';
import { UsersPage } from '@/features/users';

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersLayout,
});

function UsersLayout() {
  return (
    <PermissionsGuard resource="users" action="read" redirectTo="/dashboard">
      <UsersPage />
      <Outlet />
    </PermissionsGuard>
  );
}

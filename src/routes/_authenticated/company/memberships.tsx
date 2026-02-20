import { createFileRoute } from '@tanstack/react-router';

import { PermissionsGuard } from '@/components/ui/permissions-guard';
import { MembershipsPage } from '@/features/company/memberships';

export const Route = createFileRoute('/_authenticated/company/memberships')({
  component: MembershipsLayout,
});

function MembershipsLayout() {
  return (
    <PermissionsGuard resource="company-memberships" action="read" redirectTo="/dashboard">
      <MembershipsPage />
    </PermissionsGuard>
  );
}

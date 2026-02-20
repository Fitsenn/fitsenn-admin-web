import { createFileRoute, Outlet } from '@tanstack/react-router'

import { PermissionsGuard } from '@/components/ui/permissions-guard'
import { LocationsPage } from '@/features/company/locations'

export const Route = createFileRoute('/_authenticated/company/locations')({
  component: LocationsLayout,
})

function LocationsLayout() {
  return (
    <PermissionsGuard resource="locations" action="read" redirectTo="/dashboard">
      <LocationsPage />
      <Outlet />
    </PermissionsGuard>
  )
}

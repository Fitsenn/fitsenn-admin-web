import { createFileRoute, Outlet } from '@tanstack/react-router'

import { LocationsPage } from '@/features/company/locations'

export const Route = createFileRoute('/_authenticated/company/locations')({
  component: LocationsLayout,
})

function LocationsLayout() {
  return (
    <>
      <LocationsPage />
      <Outlet />
    </>
  )
}

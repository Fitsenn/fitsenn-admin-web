import { createFileRoute } from '@tanstack/react-router'

import { LocationsPage } from '@/features/company/locations'

export const Route = createFileRoute('/_authenticated/company/locations')({
  component: LocationsPage,
})

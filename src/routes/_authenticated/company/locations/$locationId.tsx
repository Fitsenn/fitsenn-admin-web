import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/company/locations/$locationId',
)({
  component: () => null,
})

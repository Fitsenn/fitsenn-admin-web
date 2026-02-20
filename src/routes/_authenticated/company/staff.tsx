import { createFileRoute } from '@tanstack/react-router'

import { PermissionsGuard } from '@/components/ui/permissions-guard'
import { CompanyStaffPage } from '@/features/company/staff'

export const Route = createFileRoute('/_authenticated/company/staff')({
  component: StaffLayout,
})

function StaffLayout() {
  return (
    <PermissionsGuard resource="staff" action="read" redirectTo="/dashboard">
      <CompanyStaffPage />
    </PermissionsGuard>
  )
}

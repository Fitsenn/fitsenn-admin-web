import { createFileRoute } from '@tanstack/react-router'

import { PermissionsGuard } from '@/components/ui/permissions-guard'
import { CompanySettingsPage } from '@/features/company/company-settings'

export const Route = createFileRoute('/_authenticated/company/settings')({
  component: SettingsLayout,
})

function SettingsLayout() {
  return (
    <PermissionsGuard resource="company-settings" action="read" redirectTo="/dashboard">
      <CompanySettingsPage />
    </PermissionsGuard>
  )
}

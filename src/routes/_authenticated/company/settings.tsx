import { createFileRoute } from '@tanstack/react-router'

import { CompanySettingsPage } from '@/features/company/company-settings'

export const Route = createFileRoute('/_authenticated/company/settings')({
  component: CompanySettingsPage,
})

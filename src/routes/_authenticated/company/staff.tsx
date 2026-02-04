import { createFileRoute } from '@tanstack/react-router'

import { CompanyStaffPage } from '@/features/company/staff'

export const Route = createFileRoute('/_authenticated/company/staff')({
  component: CompanyStaffPage,
})

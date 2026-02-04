import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { CompanyUsersTable } from './company-users-table'

const CompanyStaffPage = () => {
  const { t } = useTranslation()

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('companySettings.staff.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('companySettings.staff.description')}
        </Text>
      </Box>
      <CompanyUsersTable />
    </Stack>
  )
}

export { CompanyStaffPage }

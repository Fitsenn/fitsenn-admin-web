import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { UsersTable } from './users-table'

export function UsersPage() {
  const { t } = useTranslation()

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('users.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('users.description')}
        </Text>
      </Box>

      <UsersTable />
    </Stack>
  )
}

import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import { UsersTable } from './users-table'

export function UsersPage() {
  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">Users</Heading>
        <Text color="fg.muted" mt={2}>
          Manage your application users
        </Text>
      </Box>

      <UsersTable />
    </Stack>
  )
}

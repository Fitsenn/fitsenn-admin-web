import type { User } from '../types';

import { Box, Heading, Stack, Table, Text } from '@chakra-ui/react';

// Mock data - replace with real API call
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'admin',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'user',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    email: 'bob@example.com',
    name: 'Bob Johnson',
    role: 'user',
    createdAt: '2024-03-10',
  },
];

export function UsersPage() {
  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">Users</Heading>
        <Text color="fg.muted" mt={2}>
          Manage your application users
        </Text>
      </Box>

      <Box bg="bg.panel" p={6} borderRadius="lg" boxShadow="sm">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader>Created</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {mockUsers.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Text
                    fontSize="sm"
                    px={2}
                    py={1}
                    bg={user.role === 'admin' ? 'blue.100' : 'gray.100'}
                    color={user.role === 'admin' ? 'blue.800' : 'gray.800'}
                    borderRadius="md"
                    display="inline-block">
                    {user.role}
                  </Text>
                </Table.Cell>
                <Table.Cell>{user.createdAt}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Stack>
  );
}

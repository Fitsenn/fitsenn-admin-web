import type { ColumnDef } from '@tanstack/react-table';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, Box, Button, HStack, Heading } from '@chakra-ui/react';

import { DataTable } from '@/components/table';

type User = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    role: 'User',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'pending',
    role: 'User',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    status: 'inactive',
    role: 'User',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    status: 'active',
    role: 'Manager',
  },
  {
    id: '6',
    name: 'David Miller',
    email: 'david@example.com',
    status: 'active',
    role: 'User',
  },
  {
    id: '7',
    name: 'Emma Davis',
    email: 'emma@example.com',
    status: 'pending',
    role: 'User',
  },
  {
    id: '8',
    name: 'Frank Wilson',
    email: 'frank@example.com',
    status: 'active',
    role: 'Manager',
  },
  {
    id: '9',
    name: 'Grace Taylor',
    email: 'grace@example.com',
    status: 'inactive',
    role: 'User',
  },
  {
    id: '10',
    name: 'Henry Anderson',
    email: 'henry@example.com',
    status: 'active',
    role: 'User',
  },
  {
    id: '11',
    name: 'Ivy Martinez',
    email: 'ivy@example.com',
    status: 'active',
    role: 'Admin',
  },
  {
    id: '12',
    name: 'Jack Thomas',
    email: 'jack@example.com',
    status: 'pending',
    role: 'User',
  },
  {
    id: '13',
    name: 'Kate Jackson',
    email: 'kate@example.com',
    status: 'active',
    role: 'Manager',
  },
  {
    id: '14',
    name: 'Liam White',
    email: 'liam@example.com',
    status: 'inactive',
    role: 'User',
  },
  {
    id: '15',
    name: 'Mia Harris',
    email: 'mia@example.com',
    status: 'active',
    role: 'User',
  },
];

type TableState = 'data' | 'loading' | 'error' | 'empty';

const searchFields: (keyof User)[] = ['name', 'email', 'role'];

const UsersTable = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<TableState>('data');

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: t('table.id'),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: t('table.name'),
        enableSorting: true,
      },
      {
        accessorKey: 'email',
        header: t('table.email'),
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        header: t('table.status'),
        enableSorting: true,
        cell: (info: { getValue: () => unknown }) => {
          const status = info.getValue() as User['status'];
          const colorScheme = {
            active: 'green',
            inactive: 'gray',
            pending: 'yellow',
          }[status];

          return (
            <Badge colorPalette={colorScheme} textTransform="capitalize">
              {t(`table.${status}`)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'role',
        header: t('table.role'),
        enableSorting: true,
      },
    ],
    [t],
  );

  const tableData = {
    data: mockUsers,
    columns,
    enableSorting: true,
    enablePagination: true,
    pageSize: 10,
    enableSearch: true,
    searchFields,
    searchPlaceholder: t('users.searchPlaceholder'),
    enableColumnVisibility: true,
    storageKey: 'users-table',
    toolbarActions: (
      <Button size="sm" colorPalette="blue">
        {t('users.addUser')}
      </Button>
    ),
  };

  const getTableProps = () => {
    switch (state) {
      case 'loading':
        return {
          ...tableData,
          isLoading: true,
        };
      case 'error':
        return {
          ...tableData,
          error: new Error(t('users.loadError')),
        };
      case 'empty':
        return {
          ...tableData,
          data: [],
        };
      default:
        return {
          ...tableData,
        };
    }
  };

  return (
    <>
      <Box pb={3} borderBottomWidth="1px">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="md">{t('users.tableExample')}</Heading>
          <HStack gap={2}>
            <Button size="sm" variant={state === 'data' ? 'solid' : 'outline'} onClick={() => setState('data')}>
              {t('common.data')}
            </Button>
            <Button size="sm" variant={state === 'loading' ? 'solid' : 'outline'} onClick={() => setState('loading')}>
              {t('common.loading')}
            </Button>
            <Button size="sm" variant={state === 'error' ? 'solid' : 'outline'} onClick={() => setState('error')}>
              {t('common.error')}
            </Button>
            <Button size="sm" variant={state === 'empty' ? 'solid' : 'outline'} onClick={() => setState('empty')}>
              {t('common.empty')}
            </Button>
          </HStack>
        </HStack>
      </Box>
      <Box>
        <DataTable {...getTableProps()} />
      </Box>
    </>
  );
};

export { UsersTable };

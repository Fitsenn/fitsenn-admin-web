import type { ColumnDef } from '@tanstack/react-table';

import { useMemo } from 'react';

import { Badge, Button, Link as ChakraLink } from '@chakra-ui/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/table';
import { Avatar } from '@/components/ui/avatar';
import { HARDCODED_COMPANY_ID, useCompanyUsers } from '../api/get-company-users';
import { UserDetailsDrawer } from './user-details-drawer';

type MemberTableRow = {
  id: string;
  avatar: string;
  name: string;
  phone: string;
  email: string;
  membership: string;
};

const searchFields: (keyof MemberTableRow)[] = ['name', 'phone'];

const UsersTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: membersRaw, error, isLoading } = useCompanyUsers({ companyId: HARDCODED_COMPANY_ID });

  const members: MemberTableRow[] = useMemo(() => {
    if (!membersRaw) return [];

    return membersRaw.map((item) => ({
      id: item.user_id,
      avatar: item.profile.avatar_url ?? '',
      name: item.profile.first_name + ' ' + item.profile.last_name,
      phone: item.profile.phone ?? '-',
      email: item.profile.email,
      membership: item.membership ? 'Active' : 'Inactive',
    }));
  }, [membersRaw]);

  const columns: ColumnDef<MemberTableRow>[] = useMemo(
    () => [
      {
        accessorKey: 'avatar',
        header: t('users.table.avatar'),
        enableSorting: false,
        cell: ({ getValue }) => {
          const avatarUrl = getValue<string>();
          return <Avatar url={avatarUrl} />;
        },
        size: 80,
        minSize: 80,
        maxSize: 80,
      },
      {
        accessorKey: 'name',
        header: t('users.table.name'),
        enableSorting: true,
        cell: ({ row, getValue }) => {
          return (
            <ChakraLink>
              <Link to={'/users/$userId'} params={{ userId: row.original.id }}>
                <span>{getValue<string>()}</span>
              </Link>
            </ChakraLink>
          );
        },
      },
      {
        accessorKey: 'membership',
        header: t('users.table.membership'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const membership = getValue<string>();
          const isActive = membership === 'Active';

          return <Badge colorPalette={isActive ? 'green' : 'orange'}>{membership}</Badge>;
        },
      },
      {
        accessorKey: 'phone',
        header: t('users.table.phone'),
        enableSorting: true,
      },
      {
        accessorKey: 'email',
        header: t('users.table.email'),
        enableSorting: true,
      },
    ],
    [t],
  );

  return (
    <>
      <DataTable
        data={members}
        columns={columns}
        enableSorting
        isLoading={isLoading}
        error={error ? t('users.loadError') : undefined}
        enablePagination
        searchFields={searchFields}
        searchPlaceholder={t('users.searchPlaceholder')}
        enableColumnVisibility
        storageKey="users-table"
        toolbarActions={<Button size="sm">{t('users.addUser')}</Button>}
        rowActions={{
          actions: [
            {
              type: 'view',
              onClick: (row) => {
                navigate({ to: '/users/$userId', params: { userId: row.id } });
              },
            },
          ],
        }}
      />
      <UserDetailsDrawer />
    </>
  );
};

export { UsersTable };

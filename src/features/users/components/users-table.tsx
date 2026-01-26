import type { ColumnDef } from '@tanstack/react-table';

import { useMemo } from 'react';

import { Badge, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/table';
import { useCompanyMembers } from '../api/get-company-members';

type MemberTableRow = {
  name: string;
  phone: string;
  email: string;
  membership: string;
};

const searchFields: (keyof MemberTableRow)[] = ['name', 'phone'];

const HARDCODED_COMPANY_ID = 'dcd1db1e-7753-4ca6-ac7e-4c7e95a43bc7';

const UsersTable = () => {
  const { t } = useTranslation();

  const { data, error, isLoading } = useCompanyMembers({ companyId: HARDCODED_COMPANY_ID });

  const members: MemberTableRow[] = useMemo(() => {
    if (!data) return [];

    return data.map((item) => ({
      name: item.profile.first_name + ' ' + item.profile.last_name,
      phone: item.profile.phone ?? '-',
      email: item.profile.email,
      membership: item.membership ? 'Active' : 'Inactive',
    }));
  }, [data]);

  const columns: ColumnDef<MemberTableRow>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('users.table.name'),
        enableSorting: true,
      },
      {
        accessorKey: 'membership',
        header: t('users.table.membership'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const membership = getValue<string>();
          const isActive = membership === 'Active';

          return (
            <Badge colorPalette={isActive ? 'green' : 'orange'}>
              {membership}
            </Badge>
          );
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
      toolbarActions={
        <Button size="sm" colorPalette="blue">
          {t('users.addUser')}
        </Button>
      }
    />
  );
};

export { UsersTable };

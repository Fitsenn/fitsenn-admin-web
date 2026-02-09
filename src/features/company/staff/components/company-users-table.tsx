import type { ColumnDef } from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import { Badge, Button, Flex, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import { DataTable } from '@/components/table';
import { useCompany } from '@/contexts';
import { useCompanyUsers } from '../api/get-company-users';
import { InviteUserDialog } from './invite-user-dialog';

type CompanyUserRow = {
  name: string;
  email: string;
  phone: string;
  roles: string[];
  joinedAt: string;
};

const searchFields: (keyof CompanyUserRow)[] = ['name', 'email'];

const CompanyUsersTable = () => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: users = [], error, isLoading } = useCompanyUsers(companyId);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const rows: CompanyUserRow[] = useMemo(
    () =>
      users.map((user) => ({
        name: [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' ') || '-',
        email: user.profile.email ?? '-',
        phone: user.profile.phone ?? '-',
        roles: user.roles ?? [],
        joinedAt: user.joinedAt,
      })),
    [users],
  );

  const columns: ColumnDef<CompanyUserRow>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('companySettings.users.table.name'),
        enableSorting: true,
      },
      {
        accessorKey: 'email',
        header: t('companySettings.users.table.email'),
        enableSorting: true,
      },
      {
        accessorKey: 'phone',
        header: t('companySettings.users.table.phone'),
        enableSorting: true,
      },
      {
        accessorKey: 'roles',
        header: t('companySettings.users.table.roles'),
        cell: ({ getValue }) => {
          const roles = getValue<string[]>();
          return (
            <Flex gap={1} flexWrap="wrap">
              {roles.map((role) => (
                <Badge key={role} textTransform="capitalize">
                  {role}
                </Badge>
              ))}
            </Flex>
          );
        },
      },
      {
        accessorKey: 'joinedAt',
        header: t('companySettings.users.table.joinedAt'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return date ? new Date(date).toLocaleDateString() : '-';
        },
      },
    ],
    [t],
  );

  return (
    <>
      <DataTable
        data={rows}
        columns={columns}
        enableSorting
        isLoading={isLoading}
        error={error ? t('companySettings.users.loadError') : undefined}
        enablePagination
        searchFields={searchFields}
        searchPlaceholder={t('companySettings.users.searchPlaceholder')}
        enableColumnVisibility
        storageKey="company-users-table"
        toolbarActions={
          <Button size="sm" colorPalette="brand" onClick={() => setIsInviteOpen(true)}>
            <Icon boxSize={4}>
              <Plus />
            </Icon>
            {t('companySettings.users.inviteUser')}
          </Button>
        }
      />
      <InviteUserDialog isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </>
  );
};

export { CompanyUsersTable };

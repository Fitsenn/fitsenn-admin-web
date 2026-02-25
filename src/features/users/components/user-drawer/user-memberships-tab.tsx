import type { UserMembershipWithPlan } from '../../api/get-user-memberships';
import type { ColumnDef } from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import { Badge, Box, Button, Flex, Separator, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/table';
import { useDateHelpers } from '@/hooks/use-date-helpers';
import { HARDCODED_COMPANY_ID } from '../../api/get-company-users';
import { useUserMemberships } from '../../api/get-user-memberships';
import { CreateUserMembershipModal } from './create-user-membership-modal';
import { DeleteUserMembershipDialog } from './delete-user-membership-dialog';
import { EditUserMembershipModal } from './edit-user-membership-modal';

const isMembershipActive = (endsAt: string): boolean => {
  return DateTime.fromISO(endsAt) > DateTime.now();
};

const formatPrice = (price: number): string => {
  return `${price} RON`;
};

const UserMembershipsTab = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { dateFormatHelper } = useDateHelpers();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<UserMembershipWithPlan | null>(null);
  const [deletingMembership, setDeletingMembership] = useState<UserMembershipWithPlan | null>(null);

  const {
    data: memberships = [],
    error,
    isLoading,
  } = useUserMemberships({ userId, companyId: HARDCODED_COMPANY_ID });

  const columns: ColumnDef<UserMembershipWithPlan>[] = useMemo(
    () => [
      {
        accessorKey: 'membershipPlans.name',
        header: t('users.memberships.table.planName'),
        cell: ({ row }) => row.original.membershipPlans.name,
      },
      {
        id: 'type',
        header: t('users.memberships.table.type'),
        cell: ({ row }) => {
          const type = row.original.membershipPlans.type;
          const isUnlimited = type === 'unlimited';
          return (
            <Badge colorPalette={isUnlimited ? 'blue' : 'purple'}>
              {isUnlimited
                ? t('memberships.plans.type.unlimited')
                : t('memberships.plans.type.sessions')}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'sessionsRemaining',
        header: t('users.memberships.table.sessionsRemaining'),
        cell: ({ getValue }) => {
          const sessions = getValue<number | null>();
          return sessions ?? '—';
        },
      },
      {
        accessorKey: 'startsAt',
        header: t('users.memberships.table.startDate'),
        cell: ({ getValue }) => {
          const startsAt = getValue<string>();
          return dateFormatHelper(DateTime.fromISO(startsAt).toSeconds(), 'SHORT_DATE');
        },
      },
      {
        accessorKey: 'endsAt',
        header: t('users.memberships.table.endDate'),
        cell: ({ getValue }) => {
          const endsAt = getValue<string>();
          return dateFormatHelper(DateTime.fromISO(endsAt).toSeconds(), 'SHORT_DATE');
        },
      },
      {
        accessorKey: 'pricePaid',
        header: t('users.memberships.table.pricePaid'),
        cell: ({ getValue }) => formatPrice(getValue<number>()),
      },
      {
        id: 'status',
        header: t('users.memberships.table.status'),
        cell: ({ row }) => {
          const isActive = isMembershipActive(row.original.endsAt);
          return (
            <Badge colorPalette={isActive ? 'green' : 'red'}>
              {isActive
                ? t('users.memberships.status.active')
                : t('users.memberships.status.expired')}
            </Badge>
          );
        },
      },
    ],
    [t, dateFormatHelper],
  );

  return (
    <>
      <Box bgColor={{ base: 'white', _dark: 'gray.900' }} borderRadius="xl" boxShadow="subtle">
        <Flex alignItems="center" justifyContent="space-between" px={6} h="70px">
          <Text textStyle="md" fontWeight="bold">
            {t('users.memberships.title')}
          </Text>
          <Button size="xs" colorPalette="brand" onClick={() => setIsCreateOpen(true)}>
            <Plus />
            {t('users.memberships.addMembership')}
          </Button>
        </Flex>
        <Separator />
        <Box p={4}>
          <DataTable
            data={memberships}
            columns={columns}
            isLoading={isLoading}
            error={error ? t('users.memberships.loadError') : undefined}
            enablePagination
            rowActions={{
              canEdit: true,
              canDelete: true,
              actions: [
                {
                  type: 'edit',
                  onClick: (membership: UserMembershipWithPlan) => setEditingMembership(membership),
                },
                {
                  type: 'delete',
                  onClick: (membership: UserMembershipWithPlan) => setDeletingMembership(membership),
                },
              ],
            }}
          />
        </Box>
      </Box>

      <CreateUserMembershipModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        userId={userId}
      />
      <EditUserMembershipModal
        isOpen={!!editingMembership}
        onClose={() => setEditingMembership(null)}
        membership={editingMembership}
      />
      <DeleteUserMembershipDialog
        isOpen={!!deletingMembership}
        onClose={() => setDeletingMembership(null)}
        membership={deletingMembership}
      />
    </>
  );
};

export { UserMembershipsTab };

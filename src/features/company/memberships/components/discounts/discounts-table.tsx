import type { MembershipDiscount } from '@/types/company';
import type { ColumnDef } from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import { Badge, Button, Icon, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/table';
import { useCompany, usePermissions } from '@/contexts';
import { useDateHelpers } from '@/hooks/use-date-helpers';
import { useMembershipDiscounts } from '../../api/get-membership-discounts';
import { useMembershipPlans } from '../../api/get-membership-plans';
import { CreateDiscountModal } from './create-discount-modal';
import { DeleteDiscountDialog } from './delete-discount-dialog';
import { EditDiscountModal } from './edit-discount-modal';

const formatDiscountValue = (discountType: string, value: number): string => {
  if (discountType === 'percentage') return `${value}%`;
  return `${value} RON`;
};

const searchFields: (keyof MembershipDiscount)[] = ['name'];

const DiscountsTable = () => {
  const { t } = useTranslation();
  const { dateFormatHelper } = useDateHelpers();
  const { selectedCompany } = useCompany();
  const { hasPermission } = usePermissions();
  const companyId = selectedCompany?.id ?? '';

  const canWrite = hasPermission('company-memberships', 'write');

  const { data: discounts = [], error, isLoading } = useMembershipDiscounts(companyId);
  const { data: plans = [] } = useMembershipPlans(companyId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<MembershipDiscount | null>(null);
  const [deletingDiscount, setDeletingDiscount] = useState<MembershipDiscount | null>(null);

  const planMap = useMemo(() => new Map(plans.map((plan) => [plan.id, plan.name])), [plans]);

  const columns: ColumnDef<MembershipDiscount>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('memberships.discounts.table.name'),
        enableSorting: true,
      },
      {
        accessorKey: 'planIds',
        header: t('memberships.discounts.table.appliesTo'),
        cell: ({ getValue }) => {
          const planIds = getValue<string[] | null>();
          if (!planIds || planIds.length === 0) {
            return <Text color="fg.muted">{t('memberships.discounts.allPlans')}</Text>;
          }
          return planIds
            .map((id) => planMap.get(id))
            .filter(Boolean)
            .join(', ');
        },
      },
      {
        accessorKey: 'discountValue',
        header: t('memberships.discounts.table.value'),
        enableSorting: true,
        cell: ({ row }) => formatDiscountValue(row.original.discountType, row.original.discountValue),
      },
      {
        accessorKey: 'startsAt',
        header: t('memberships.discounts.table.startsAt'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const startsAt = getValue<string | null>();
          if (!startsAt) return '—';
          return dateFormatHelper(DateTime.fromISO(startsAt).toSeconds(), 'SHORT_DATE');
        },
      },
      {
        accessorKey: 'endsAt',
        header: t('memberships.discounts.table.endsAt'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const endsAt = getValue<string | null>();
          if (!endsAt) return <Text color="fg.muted">{t('memberships.discounts.indefinitely')}</Text>;
          return dateFormatHelper(DateTime.fromISO(endsAt).toSeconds(), 'SHORT_DATE');
        },
      },
      {
        accessorKey: 'isActive',
        header: t('memberships.discounts.table.status'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const isActive = getValue<boolean>();
          return (
            <Badge colorPalette={isActive ? 'green' : 'gray'}>
              {isActive ? t('memberships.discounts.status.active') : t('memberships.discounts.status.inactive')}
            </Badge>
          );
        },
      },
    ],
    [t, planMap, dateFormatHelper],
  );

  return (
    <>
      <DataTable
        data={discounts}
        columns={columns}
        enableSorting
        isLoading={isLoading}
        error={error ? t('memberships.discounts.loadError') : undefined}
        enablePagination
        searchFields={searchFields}
        searchPlaceholder={t('memberships.discounts.searchPlaceholder')}
        enableColumnVisibility
        storageKey="membership-discounts-table"
        toolbarActions={
          canWrite ? (
            <Button size="sm" colorPalette="brand" onClick={() => setIsCreateOpen(true)}>
              <Icon boxSize={4}>
                <Plus />
              </Icon>
              {t('memberships.discounts.addDiscount')}
            </Button>
          ) : undefined
        }
        rowActions={{
          canEdit: canWrite,
          canDelete: canWrite,
          actions: [
            {
              type: 'edit',
              onClick: (discount: MembershipDiscount) => setEditingDiscount(discount),
            },
            {
              type: 'delete',
              onClick: (discount: MembershipDiscount) => setDeletingDiscount(discount),
            },
          ],
        }}
      />
      <CreateDiscountModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditDiscountModal discount={editingDiscount} onClose={() => setEditingDiscount(null)} />
      <DeleteDiscountDialog discount={deletingDiscount} onClose={() => setDeletingDiscount(null)} />
    </>
  );
};

export { DiscountsTable };

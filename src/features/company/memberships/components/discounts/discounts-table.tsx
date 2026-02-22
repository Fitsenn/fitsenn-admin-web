import type { MembershipDiscount } from '@/types/company';
import type { ColumnDef } from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import { Badge, Button, Icon, Text } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/table';
import { useCompany, usePermissions } from '@/contexts';
import { useMembershipDiscounts } from '../../api/get-membership-discounts';
import { useMembershipPlans } from '../../api/get-membership-plans';
import { CreateDiscountModal } from './create-discount-modal';
import { EditDiscountModal } from './edit-discount-modal';

const formatDiscountValue = (discountType: string, value: number): string => {
  if (discountType === 'percentage') return `${value}%`;
  return `${value} RON`;
};

const searchFields: (keyof MembershipDiscount)[] = ['name'];

const DiscountsTable = () => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const { hasPermission } = usePermissions();
  const companyId = selectedCompany?.id ?? '';

  const canWrite = hasPermission('company-memberships', 'write');

  const { data: discounts = [], error, isLoading } = useMembershipDiscounts(companyId);
  const { data: plans = [] } = useMembershipPlans(companyId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<MembershipDiscount | null>(null);

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
    [t, planMap],
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
          actions: [
            {
              type: 'edit',
              onClick: (discount: MembershipDiscount) => setEditingDiscount(discount),
            },
          ],
        }}
      />
      <CreateDiscountModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditDiscountModal discount={editingDiscount} onClose={() => setEditingDiscount(null)} />
    </>
  );
};

export { DiscountsTable };

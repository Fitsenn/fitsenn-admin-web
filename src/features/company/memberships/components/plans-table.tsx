import type { MembershipPlan } from '@/types/company';
import type { ColumnDef } from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import { Badge, Button, Icon } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCompanyLocations } from '@/api/get-company-locations';
import { DataTable } from '@/components/table';
import { useCompany, usePermissions } from '@/contexts';
import { useMembershipPlans } from '../api/get-membership-plans';
import { DeletePlanDialog } from './delete-plan-dialog';
import { formatDuration, formatPrice } from './plans-table.utils';

const searchFields: (keyof MembershipPlan)[] = ['name'];

const PlansTable = () => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const { hasPermission } = usePermissions();
  const companyId = selectedCompany?.id ?? '';

  const canWrite = hasPermission('company-memberships', 'write');
  const canDelete = hasPermission('company-memberships', 'delete');

  const { data: plans = [], error, isLoading } = useMembershipPlans(companyId);
  const { data: locations = [] } = useCompanyLocations({ companyId });

  const [deletingPlan, setDeletingPlan] = useState<MembershipPlan | null>(null);

  const locationMap = useMemo(
    () => new Map(locations.map((loc) => [loc.id, loc.name])),
    [locations],
  );

  const handleCreatePlan = () => {
    // TODO: navigate to create plan modal
  };

  const handleEditPlan = (_plan: MembershipPlan) => {
    // TODO: navigate to edit plan modal
  };

  const handleDuplicatePlan = (_plan: MembershipPlan) => {
    // TODO: navigate to create plan modal with pre-filled data
  };

  const columns: ColumnDef<MembershipPlan>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('memberships.plans.table.name'),
        enableSorting: true,
      },
      {
        accessorKey: 'type',
        header: t('memberships.plans.table.type'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const type = getValue<string>();
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
        accessorKey: 'durationDays',
        header: t('memberships.plans.table.duration'),
        enableSorting: true,
        cell: ({ getValue }) => formatDuration(getValue<number>(), t),
      },
      {
        accessorKey: 'sessionsCount',
        header: t('memberships.plans.table.sessions'),
        cell: ({ getValue }) => {
          const count = getValue<number | null>();
          return count ?? '—';
        },
      },
      {
        accessorKey: 'price',
        header: t('memberships.plans.table.price'),
        enableSorting: true,
        cell: ({ getValue }) => formatPrice(getValue<number>()),
      },
      {
        accessorKey: 'locationId',
        header: t('memberships.plans.table.location'),
        cell: ({ getValue }) => {
          const locationId = getValue<string | null>();
          if (!locationId) return t('memberships.plans.allLocations');
          return locationMap.get(locationId) ?? t('memberships.plans.allLocations');
        },
      },
      {
        accessorKey: 'isActive',
        header: t('memberships.plans.table.status'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const isActive = getValue<boolean>();
          return (
            <Badge colorPalette={isActive ? 'green' : 'gray'}>
              {isActive
                ? t('memberships.plans.status.active')
                : t('memberships.plans.status.inactive')}
            </Badge>
          );
        },
      },
    ],
    [t, locationMap],
  );

  return (
    <>
      <DataTable
        data={plans}
        columns={columns}
        enableSorting
        isLoading={isLoading}
        error={error ? t('memberships.plans.loadError') : undefined}
        enablePagination
        searchFields={searchFields}
        searchPlaceholder={t('memberships.plans.searchPlaceholder')}
        enableColumnVisibility
        storageKey="membership-plans-table"
        toolbarActions={
          canWrite ? (
            <Button size="sm" colorPalette="brand" onClick={handleCreatePlan}>
              <Icon boxSize={4}>
                <Plus />
              </Icon>
              {t('memberships.plans.addPlan')}
            </Button>
          ) : undefined
        }
        rowActions={{
          canEdit: canWrite || canDelete,
          actions: [
            ...(canWrite
              ? [
                  {
                    type: 'edit' as const,
                    onClick: handleEditPlan,
                  },
                  {
                    type: 'duplicate' as const,
                    onClick: handleDuplicatePlan,
                  },
                ]
              : []),
            ...(canDelete
              ? [
                  {
                    type: 'delete' as const,
                    onClick: (plan: MembershipPlan) => setDeletingPlan(plan),
                  },
                ]
              : []),
          ],
        }}
      />
      <DeletePlanDialog
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        plan={deletingPlan}
      />
    </>
  );
};

export { PlansTable };

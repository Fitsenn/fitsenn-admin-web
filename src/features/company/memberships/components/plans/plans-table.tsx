import type { MembershipPlan } from '@/types/company';
import type { ColumnDef } from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import { Badge, Button, Icon } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCompanyLocations } from '@/api/get-company-locations';
import { DataTable } from '@/components/table';
import { useCompany, usePermissions } from '@/contexts';
import { useMembershipPlans } from '../../api/get-membership-plans';
import { CreatePlanModal } from './create-plan-modal';
import { DeletePlanDialog } from './delete-plan-dialog';
import { EditPlanModal } from './edit-plan-modal';
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

  const navigate = useNavigate();
  const [deletingPlan, setDeletingPlan] = useState<MembershipPlan | null>(null);

  const locationMap = useMemo(() => new Map(locations.map((loc) => [loc.id, loc.name])), [locations]);

  const handleCreatePlan = () => {
    navigate({ to: '/company/memberships/add' });
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    navigate({ to: '/company/memberships/$planId', params: { planId: plan.id } });
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
              {isUnlimited ? t('memberships.plans.type.unlimited') : t('memberships.plans.type.sessions')}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'duration',
        header: t('memberships.plans.table.duration'),
        enableSorting: true,
        cell: ({ row }) => formatDuration(row.original.duration, row.original.durationUnit, t),
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
              {isActive ? t('memberships.plans.status.active') : t('memberships.plans.status.inactive')}
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
          canEdit: canWrite,
          canDelete: canDelete,
          actions: [
            {
              type: 'edit',
              onClick: handleEditPlan,
            },
            {
              type: 'delete',
              onClick: (plan: MembershipPlan) => setDeletingPlan(plan),
            },
          ],
        }}
      />
      <DeletePlanDialog isOpen={!!deletingPlan} onClose={() => setDeletingPlan(null)} plan={deletingPlan} />
      <CreatePlanModal />
      <EditPlanModal />
    </>
  );
};

export { PlansTable };

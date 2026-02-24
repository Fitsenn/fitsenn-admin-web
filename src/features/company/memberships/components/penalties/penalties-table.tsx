import type { MembershipPlanPenalty } from '@/types/company';
import type { ColumnDef } from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import { Badge, Button, Icon, Text } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/table';
import { useCompany, usePermissions } from '@/contexts';
import { useMembershipPenalties } from '../../api/get-membership-penalties';
import { useMembershipPlans } from '../../api/get-membership-plans';
import { CreatePenaltyModal } from './create-penalty-modal';
import { DeletePenaltyDialog } from './delete-penalty-dialog';
import { EditPenaltyModal } from './edit-penalty-modal';

const searchFields: (keyof MembershipPlanPenalty)[] = ['name', 'triggerType'];

const PenaltiesTable = () => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const { hasPermission } = usePermissions();
  const companyId = selectedCompany?.id ?? '';

  const canWrite = hasPermission('company-memberships', 'write');

  const { data: penalties = [], error, isLoading } = useMembershipPenalties(companyId);
  const { data: plans = [] } = useMembershipPlans(companyId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPenalty, setEditingPenalty] = useState<MembershipPlanPenalty | null>(null);
  const [deletingPenalty, setDeletingPenalty] = useState<MembershipPlanPenalty | null>(null);

  const planMap = useMemo(() => new Map(plans.map((plan) => [plan.id, plan.name])), [plans]);

  const columns: ColumnDef<MembershipPlanPenalty>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('memberships.penalties.table.name'),
        enableSorting: true,
      },
      {
        accessorKey: 'planIds',
        header: t('memberships.penalties.table.appliesTo'),
        cell: ({ getValue }) => {
          const planIds = getValue<string[] | null>();
          if (!planIds || planIds.length === 0) {
            return <Text color="fg.muted">{t('memberships.penalties.allPlans')}</Text>;
          }
          return planIds
            .map((id) => planMap.get(id))
            .filter(Boolean)
            .join(', ');
        },
      },
      {
        accessorKey: 'triggerType',
        header: t('memberships.penalties.table.triggerType'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const triggerType = getValue<string>();
          const colorPalette = triggerType === 'no_show' ? 'red' : 'orange';
          return (
            <Badge colorPalette={colorPalette}>
              {t(`memberships.penalties.triggerType.${triggerType}`, triggerType)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'triggerCount',
        header: t('memberships.penalties.table.triggerCount'),
        enableSorting: true,
      },
      {
        accessorKey: 'triggerWindowDays',
        header: t('memberships.penalties.table.triggerWindowDays'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const days = getValue<number>();
          return t('memberships.penalties.daysCount', { count: days });
        },
      },
      {
        accessorKey: 'banDays',
        header: t('memberships.penalties.table.banDays'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const days = getValue<number>();
          return t('memberships.penalties.daysCount', { count: days });
        },
      },
    ],
    [t, planMap],
  );

  return (
    <>
      <DataTable
        data={penalties}
        columns={columns}
        enableSorting
        isLoading={isLoading}
        error={error ? t('memberships.penalties.loadError') : undefined}
        enablePagination
        searchFields={searchFields}
        searchPlaceholder={t('memberships.penalties.searchPlaceholder')}
        enableColumnVisibility
        storageKey="membership-penalties-table"
        toolbarActions={
          canWrite ? (
            <Button size="sm" colorPalette="brand" onClick={() => setIsCreateOpen(true)}>
              <Icon boxSize={4}>
                <Plus />
              </Icon>
              {t('memberships.penalties.addPenalty')}
            </Button>
          ) : undefined
        }
        rowActions={{
          canEdit: canWrite,
          canDelete: canWrite,
          actions: [
            {
              type: 'edit',
              onClick: (penalty: MembershipPlanPenalty) => setEditingPenalty(penalty),
            },
            {
              type: 'delete',
              onClick: (penalty: MembershipPlanPenalty) => setDeletingPenalty(penalty),
            },
          ],
        }}
      />
      <CreatePenaltyModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditPenaltyModal penalty={editingPenalty} onClose={() => setEditingPenalty(null)} />
      <DeletePenaltyDialog penalty={deletingPenalty} onClose={() => setDeletingPenalty(null)} />
    </>
  );
};

export { PenaltiesTable };

import type { Location } from '@/types/location';
import type { ColumnDef } from '@tanstack/react-table';

import { useCallback, useMemo, useState } from 'react';

import { Badge, Button, HStack, Icon, Switch } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCompanyLocations } from '@/api/get-company-locations';
import { DataTable } from '@/components/table';
import { useCompany, usePermissions } from '@/contexts';
import { useToggleLocationStatus } from '../api/toggle-location-status';
import { CreateLocationModal } from './create-location-modal';
import { DeactivateLocationDialog } from './deactivate-location-dialog';
import { EditLocationModal } from './edit-location-modal';

const searchFields: (keyof Location)[] = ['name', 'address'];

const LocationsTable = () => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const { hasPermission } = usePermissions();
  const companyId = selectedCompany?.id ?? '';

  const canWrite = hasPermission('locations', 'write');
  const canDelete = hasPermission('locations', 'delete');

  const {
    data: locations = [],
    error,
    isLoading,
  } = useCompanyLocations({
    companyId,
  });
  const toggleMutation = useToggleLocationStatus(companyId);

  const navigate = useNavigate();
  const [deactivatingLocation, setDeactivatingLocation] = useState<Location | null>(null);

  const handleAddLocation = () => {
    navigate({ to: '/company/locations/add' });
  };

  const handleEditLocation = (location: Location) => {
    navigate({ to: '/company/locations/$locationId', params: { locationId: location.id } });
  };

  const handleToggleStatus = useCallback(
    (location: Location, newStatus: boolean) => {
      if (newStatus) {
        // Activating - no confirmation needed
        toggleMutation.mutate({
          locationId: location.id,
          isActive: true,
        });
      } else {
        // Deactivating - show confirmation dialog
        setDeactivatingLocation(location);
      }
    },
    [toggleMutation],
  );

  const handleCloseDeactivateDialog = () => {
    setDeactivatingLocation(null);
  };

  const columns: ColumnDef<Location>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('locations.table.name'),
        enableSorting: true,
      },
      {
        accessorKey: 'address',
        header: t('locations.table.address'),
        enableSorting: true,
        cell: ({ getValue }) => getValue<string>() || '-',
      },
      {
        accessorKey: 'tier',
        header: t('locations.table.tier'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const tier = getValue<string>();
          if (!tier) return '-';
          return <Badge textTransform="capitalize">{tier}</Badge>;
        },
      },
      {
        accessorKey: 'isActive',
        header: t('locations.table.status'),
        enableSorting: true,
        cell: ({ row }) => {
          const location = row.original;
          const isActive = location.isActive;
          return (
            <HStack gap={2}>
              <Switch.Root
                size="sm"
                checked={isActive}
                onCheckedChange={(e) => handleToggleStatus(location, e.checked)}
                disabled={!canWrite || toggleMutation.isPending}>
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Root>
              <Badge colorPalette={isActive ? 'green' : 'gray'}>
                {isActive ? t('locations.status.active') : t('locations.status.inactive')}
              </Badge>
            </HStack>
          );
        },
      },
    ],
    [t, toggleMutation.isPending, handleToggleStatus, canWrite],
  );

  return (
    <>
      <DataTable
        data={locations}
        columns={columns}
        enableSorting
        isLoading={isLoading}
        error={error ? t('locations.loadError') : undefined}
        enablePagination
        searchFields={searchFields}
        searchPlaceholder={t('locations.searchPlaceholder')}
        enableColumnVisibility
        storageKey="locations-table"
        toolbarActions={
          canWrite ? (
            <Button size="sm" colorPalette="brand" onClick={handleAddLocation}>
              <Icon boxSize={4}>
                <Plus />
              </Icon>
              {t('locations.addLocation')}
            </Button>
          ) : undefined
        }
        rowActions={{
          canEdit: canWrite,
          canDelete,
          actions: [
            {
              type: 'edit',
              onClick: handleEditLocation,
            },
            {
              type: 'delete',
              onClick: (location: Location) => setDeactivatingLocation(location),
            },
          ],
        }}
      />
      <CreateLocationModal />
      <EditLocationModal />
      <DeactivateLocationDialog
        isOpen={!!deactivatingLocation}
        onClose={handleCloseDeactivateDialog}
        location={deactivatingLocation}
      />
    </>
  );
};

export { LocationsTable };

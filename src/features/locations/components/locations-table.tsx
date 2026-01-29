import type { ColumnDef } from '@tanstack/react-table';
import type { Location } from '../types';

import { useMemo, useState } from 'react';

import { Badge, Button, HStack, Icon, IconButton, Switch } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Pencil, Plus } from 'lucide-react';

import { useCompanyLocations } from '@/api/get-company-locations';
import { DataTable } from '@/components/table';
import { useCompany } from '@/hooks/use-company';
import { useToggleLocationStatus } from '../api/toggle-location-status';
import { DeactivateLocationDialog } from './deactivate-location-dialog';
import { LocationModal } from './location-modal';

const searchFields: (keyof Location)[] = ['name', 'address'];

const LocationsTable = () => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: locations = [], error, isLoading } = useCompanyLocations({
    companyId,
    activeOnly: false,
  });
  const toggleMutation = useToggleLocationStatus(companyId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deactivatingLocation, setDeactivatingLocation] = useState<Location | null>(null);

  const handleAddLocation = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  const handleToggleStatus = (location: Location, newStatus: boolean) => {
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
  };

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
          return (
            <Badge textTransform="capitalize">
              {tier}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'is_active',
        header: t('locations.table.status'),
        enableSorting: true,
        cell: ({ row }) => {
          const location = row.original;
          const isActive = location.is_active;
          return (
            <HStack gap={2}>
              <Switch.Root
                size="sm"
                checked={isActive}
                onCheckedChange={(e) => handleToggleStatus(location, e.checked)}
                disabled={toggleMutation.isPending}
              >
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
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <IconButton
            aria-label={t('common.edit')}
            variant="ghost"
            size="sm"
            onClick={() => handleEditLocation(row.original)}
          >
            <Icon boxSize={4}>
              <Pencil />
            </Icon>
          </IconButton>
        ),
      },
    ],
    [t, toggleMutation.isPending],
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
          <Button size="sm" colorPalette="brand" onClick={handleAddLocation}>
            <Icon boxSize={4}>
              <Plus />
            </Icon>
            {t('locations.addLocation')}
          </Button>
        }
      />
      <LocationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        location={editingLocation}
      />
      <DeactivateLocationDialog
        isOpen={!!deactivatingLocation}
        onClose={handleCloseDeactivateDialog}
        location={deactivatingLocation}
      />
    </>
  );
};

export { LocationsTable };

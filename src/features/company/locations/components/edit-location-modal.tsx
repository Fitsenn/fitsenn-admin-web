import type { LocationFormData } from './location-form.schema';

import { useMemo } from 'react';

import { useMatch, useNavigate } from '@tanstack/react-router';

import { useCompanyLocations } from '@/api/get-company-locations';
import { useCompany } from '@/hooks/use-company';
import { useUpdateLocation } from '../api/update-location';
import { LocationForm } from './location-form';

const EditLocationModal = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: locations = [] } = useCompanyLocations({
    companyId,
  });

  const match = useMatch({
    from: '/_authenticated/company/locations/$locationId',
    shouldThrow: false,
  });

  const locationId = match?.params?.locationId;
  const isOpen = !!locationId;
  const location = locationId ? locations.find((loc) => loc.id === locationId) : null;

  const updateMutation = useUpdateLocation(companyId);

  const handleSubmit = async (data: LocationFormData) => {
    if (!location) return;

    await updateMutation.mutateAsync({
      locationId: location.id,
      name: data.name,
      address: data.address || null,
      tier: data.tier || null,
      isActive: data.isActive,
      operatingHours: data.operatingHours,
    });

    navigate({ to: '/company/locations' });
  };

  const initialValues = useMemo(() => {
    if (!location) return undefined;
    return {
      name: location.name,
      address: location.address ?? '',
      tier: location.tier ?? '',
      isActive: location.isActive,
      operatingHours: location.operatingHours ?? {},
    };
  }, [location]);

  return (
    <LocationForm
      isOpen={isOpen}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      isSubmitting={updateMutation.isPending}
    />
  );
};

export { EditLocationModal };

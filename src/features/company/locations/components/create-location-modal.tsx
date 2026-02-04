import type { LocationFormData } from './location-form.schema';

import { useMatch, useNavigate } from '@tanstack/react-router';

import { useCompany } from '@/hooks/use-company';
import { useCreateLocation } from '../api/create-location';
import { LocationForm } from './location-form';

const CreateLocationModal = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const match = useMatch({
    from: '/_authenticated/company/locations/add',
    shouldThrow: false,
  });

  const isOpen = !!match;
  const createMutation = useCreateLocation();

  const handleSubmit = async (data: LocationFormData) => {
    await createMutation.mutateAsync({
      company_id: companyId,
      name: data.name,
      address: data.address || null,
      tier: data.tier || null,
      is_active: data.is_active,
      operating_hours: data.operating_hours,
    });

    navigate({ to: '/company/locations' });
  };

  return <LocationForm isOpen={isOpen} onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />;
};

export { CreateLocationModal };

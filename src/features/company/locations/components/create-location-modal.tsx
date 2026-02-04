import type { LocationFormData } from './location-form.schema';
import type { OperatingHours } from '@/types/location';

import { Button, Dialog } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCompany } from '@/hooks/use-company';
import { useCreateLocation } from '../api/create-location';
import { DAYS, locationSchema } from './location-form.schema';
import { LocationForm } from './location-form';

type CreateLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateLocationModal = ({ isOpen, onClose }: CreateLocationModalProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const createMutation = useCreateLocation();

  const methods = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      address: '',
      tier: '',
      is_active: true,
      operating_hours: {},
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: LocationFormData) => {
    const operatingHoursData: OperatingHours = {};
    DAYS.forEach((day) => {
      const daySlots = data.operating_hours?.[day];
      if (daySlots && daySlots.length > 0) {
        const validSlots = daySlots.filter((slot) => slot.open && slot.close);
        if (validSlots.length > 0) {
          operatingHoursData[day] = validSlots;
        }
      }
    });

    const hasOperatingHours = Object.keys(operatingHoursData).length > 0;

    await createMutation.mutateAsync({
      company_id: companyId,
      name: data.name,
      address: data.address || null,
      tier: data.tier || null,
      is_active: data.is_active,
      operating_hours: hasOperatingHours ? operatingHoursData : null,
    });

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="550px">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>{t('locations.addLocation')}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <LocationForm />
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={handleClose} disabled={createMutation.isPending}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" colorPalette="brand" loading={createMutation.isPending}>
                  {t('common.create')}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export { CreateLocationModal };

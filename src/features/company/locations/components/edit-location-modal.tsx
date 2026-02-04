import type { Location, OperatingHours } from '@/types/location';
import type { LocationFormData } from './location-form.schema';

import { useEffect } from 'react';

import { Button, Dialog } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCompany } from '@/hooks/use-company';
import { useUpdateLocation } from '../api/update-location';
import { DAYS, locationSchema } from './location-form.schema';
import { LocationForm } from './location-form';

type EditLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  location: Location;
};

const EditLocationModal = ({ isOpen, onClose, location }: EditLocationModalProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const updateMutation = useUpdateLocation(companyId);

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

  useEffect(() => {
    if (isOpen) {
      reset({
        name: location.name,
        address: location.address ?? '',
        tier: location.tier ?? '',
        is_active: location.is_active,
        operating_hours: location.operating_hours ?? {},
      });
    }
  }, [isOpen, location, reset]);

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

    await updateMutation.mutateAsync({
      location_id: location.id,
      name: data.name,
      address: data.address || null,
      tier: data.tier || null,
      is_active: data.is_active,
      operating_hours: hasOperatingHours ? operatingHoursData : null,
    });

    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="550px">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>{t('locations.editLocation')}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <LocationForm />
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" colorPalette="brand" loading={updateMutation.isPending}>
                  {t('common.save')}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export { EditLocationModal };

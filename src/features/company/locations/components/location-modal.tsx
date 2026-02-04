import type { Location, OperatingHours } from '@/types/location';

import { useEffect } from 'react';

import {
  Box,
  Button,
  Dialog,
  Fieldset,
  HStack,
  Icon,
  IconButton,
  Input,
  NativeSelect,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { InputRHF } from '@/components/form/input';
import { useCompany } from '@/hooks/use-company';
import { minutesToTimeString, timeStringToMinutes } from '@/utils/time';
import { useCreateLocation } from '../api/create-location';
import { useUpdateLocation } from '../api/update-location';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const TIER_OPTIONS = [
  { value: '', label: '' },
  { value: 'standard', label: 'Standard' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
];

// Form uses string times for input compatibility (HH:MM format)
type FormTimeSlot = { open: string; close: string };

const timeSlotSchema = z.object({
  open: z.string(),
  close: z.string(),
});

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  tier: z.string().optional(),
  is_active: z.boolean(),
  operating_hours: z.record(z.array(timeSlotSchema).nullable()).optional(),
});

type LocationFormData = z.infer<typeof locationSchema>;

type LocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
};

const DEFAULT_TIME_SLOT: FormTimeSlot = { open: '09:00', close: '21:00' };

const LocationModal = ({ isOpen, onClose, location }: LocationModalProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation(companyId);

  const isEditMode = !!location;
  const isLoading = createMutation.isPending || updateMutation.isPending;

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

  const { handleSubmit, reset, watch, setValue, control } = methods;
  // eslint-disable-next-line react-hooks/incompatible-library
  const operatingHours = watch('operating_hours') ?? {};

  // Convert DB format (minutes) to form format (time strings) on load
  useEffect(() => {
    if (isOpen) {
      if (location) {
        const convertedHours: Record<string, FormTimeSlot[] | null> = {};
        if (location.operating_hours) {
          DAYS.forEach((day) => {
            const dayData = location.operating_hours?.[day];
            if (dayData && Array.isArray(dayData)) {
              convertedHours[day] = dayData.map((slot) => ({
                open: minutesToTimeString(slot.open),
                close: minutesToTimeString(slot.close),
              }));
            }
          });
        }
        reset({
          name: location.name,
          address: location.address ?? '',
          tier: location.tier ?? '',
          is_active: location.is_active,
          operating_hours: convertedHours,
        });
      } else {
        reset({
          name: '',
          address: '',
          tier: '',
          is_active: true,
          operating_hours: {},
        });
      }
    }
  }, [isOpen, location, reset]);

  // Convert form format (time strings) to DB format (minutes) on save
  const onSubmit = async (data: LocationFormData) => {
    const operatingHoursData: OperatingHours = {};
    DAYS.forEach((day) => {
      const daySlots = data.operating_hours?.[day];
      if (daySlots && daySlots.length > 0) {
        // Filter out empty slots and convert to minutes
        const validSlots = daySlots
          .filter((slot) => slot.open && slot.close)
          .map((slot) => ({
            open: timeStringToMinutes(slot.open),
            close: timeStringToMinutes(slot.close),
          }));
        if (validSlots.length > 0) {
          operatingHoursData[day] = validSlots;
        }
      }
    });

    const hasOperatingHours = Object.keys(operatingHoursData).length > 0;

    if (isEditMode && location) {
      await updateMutation.mutateAsync({
        location_id: location.id,
        name: data.name,
        address: data.address || null,
        tier: data.tier || null,
        is_active: data.is_active,
        operating_hours: hasOperatingHours ? operatingHoursData : null,
      });
    } else {
      await createMutation.mutateAsync({
        company_id: companyId,
        name: data.name,
        address: data.address || null,
        tier: data.tier || null,
        is_active: data.is_active,
        operating_hours: hasOperatingHours ? operatingHoursData : null,
      });
    }
    onClose();
  };

  const handleDayToggle = (day: string, enabled: boolean) => {
    if (enabled) {
      setValue(`operating_hours.${day}`, [{ ...DEFAULT_TIME_SLOT }]);
    } else {
      setValue(`operating_hours.${day}`, null);
    }
  };

  const handleAddTimeSlot = (day: string) => {
    const currentSlots = operatingHours[day] ?? [];
    setValue(`operating_hours.${day}`, [...currentSlots, { open: '18:00', close: '22:00' }]);
  };

  const handleRemoveTimeSlot = (day: string, index: number) => {
    const currentSlots = operatingHours[day] ?? [];
    if (currentSlots.length === 1) {
      // If removing the last slot, disable the day
      setValue(`operating_hours.${day}`, null);
    } else {
      const newSlots = currentSlots.filter((_, i) => i !== index);
      setValue(`operating_hours.${day}`, newSlots);
    }
  };

  const handleUpdateTimeSlot = (day: string, index: number, field: 'open' | 'close', value: string) => {
    const currentSlots = operatingHours[day] ?? [];
    const newSlots = currentSlots.map((slot, i) => {
      if (i === index) {
        return { ...slot, [field]: value };
      }
      return slot;
    });
    setValue(`operating_hours.${day}`, newSlots);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="550px">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>{isEditMode ? t('locations.editLocation') : t('locations.addLocation')}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <InputRHF<LocationFormData> name="name" control={control} label={t('locations.form.name')} required />
                  <InputRHF<LocationFormData> name="address" control={control} label={t('locations.form.address')} />
                  <Fieldset.Root>
                    <Fieldset.Legend fontSize="sm" fontWeight="medium" mb={1}>
                      {t('locations.form.tier')}
                    </Fieldset.Legend>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={watch('tier') ?? ''}
                        onChange={(e) => setValue('tier', e.target.value)}>
                        {TIER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value === '' ? t('locations.form.selectTier') : option.label}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Fieldset.Root>
                  <Fieldset.Root>
                    <HStack justify="space-between">
                      <Fieldset.Legend fontSize="sm" fontWeight="medium">
                        {t('locations.form.isActive')}
                      </Fieldset.Legend>
                      <Switch.Root
                        checked={watch('is_active')}
                        onCheckedChange={(e) => setValue('is_active', e.checked)}>
                        <Switch.HiddenInput />
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Root>
                    </HStack>
                  </Fieldset.Root>

                  <Fieldset.Root>
                    <Fieldset.Legend fontSize="sm" fontWeight="medium" mb={2}>
                      {t('locations.form.operatingHours')}
                    </Fieldset.Legend>
                    <Stack gap={3}>
                      {DAYS.map((day) => {
                        const daySlots = operatingHours[day];
                        const isEnabled = Array.isArray(daySlots) && daySlots.length > 0;
                        return (
                          <Box key={day}>
                            <HStack justify="space-between" align="center" mb={isEnabled ? 2 : 0}>
                              <HStack gap={2} minW="120px">
                                <Switch.Root
                                  size="sm"
                                  checked={isEnabled}
                                  onCheckedChange={(e) => handleDayToggle(day, e.checked)}>
                                  <Switch.HiddenInput />
                                  <Switch.Control>
                                    <Switch.Thumb />
                                  </Switch.Control>
                                </Switch.Root>
                                <Text fontSize="sm" fontWeight={isEnabled ? 'medium' : 'normal'}>
                                  {t(`locations.days.${day}`)}
                                </Text>
                              </HStack>
                              {isEnabled && (
                                <IconButton
                                  aria-label={t('locations.form.addTimeSlot')}
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleAddTimeSlot(day)}>
                                  <Icon boxSize={3}>
                                    <Plus />
                                  </Icon>
                                </IconButton>
                              )}
                            </HStack>
                            {isEnabled && (
                              <Stack gap={1} pl={8}>
                                {daySlots.map((slot, index) => (
                                  <HStack key={index} gap={2}>
                                    <Input
                                      type="time"
                                      size="sm"
                                      value={slot.open}
                                      onChange={(e) => handleUpdateTimeSlot(day, index, 'open', e.target.value)}
                                      w="auto"
                                    />
                                    <Text fontSize="sm" color="fg.muted">
                                      -
                                    </Text>
                                    <Input
                                      type="time"
                                      size="sm"
                                      value={slot.close}
                                      onChange={(e) => handleUpdateTimeSlot(day, index, 'close', e.target.value)}
                                      w="auto"
                                    />
                                    <IconButton
                                      aria-label={t('locations.form.removeTimeSlot')}
                                      variant="ghost"
                                      size="xs"
                                      colorPalette="red"
                                      onClick={() => handleRemoveTimeSlot(day, index)}>
                                      <Icon boxSize={3}>
                                        <X />
                                      </Icon>
                                    </IconButton>
                                  </HStack>
                                ))}
                              </Stack>
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Fieldset.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" colorPalette="brand" loading={isLoading}>
                  {isEditMode ? t('common.save') : t('common.create')}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export { LocationModal };

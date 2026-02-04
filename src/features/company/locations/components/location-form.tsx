import type { LocationFormData } from './location-form.schema';

import {
  Box,
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
import { Plus, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InputRHF } from '@/components/form/input';
import { DAYS, DEFAULT_TIME_SLOT, TIER_OPTIONS } from './location-form.schema';

const LocationForm = () => {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext<LocationFormData>();

  const operatingHours = watch('operating_hours') ?? {};

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
    <Stack gap={4}>
      <InputRHF<LocationFormData> name="name" control={control} label={t('locations.form.name')} required />
      <InputRHF<LocationFormData> name="address" control={control} label={t('locations.form.address')} />

      <Fieldset.Root>
        <Fieldset.Legend fontSize="sm" fontWeight="medium" mb={1}>
          {t('locations.form.tier')}
        </Fieldset.Legend>
        <NativeSelect.Root>
          <NativeSelect.Field value={watch('tier') ?? ''} onChange={(e) => setValue('tier', e.target.value)}>
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
          <Switch.Root checked={watch('is_active')} onCheckedChange={(e) => setValue('is_active', e.checked)}>
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
  );
};

export { LocationForm };

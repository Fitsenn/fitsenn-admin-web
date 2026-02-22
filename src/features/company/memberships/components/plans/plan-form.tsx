import type { DefaultValues } from 'react-hook-form';
import type { PlanFormData } from './plan-form.schema';

import { useEffect, useMemo } from 'react';

import { Alert, Box, Button, Fieldset, HStack, Stack, Text, Textarea } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCompanyLocations } from '@/api/get-company-locations';
import { CheckboxGroupRHF } from '@/components/form/checkbox-group';
import { FieldWrapperRHF } from '@/components/form/field-wrapper';
import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { SelectRHF } from '@/components/form/select';
import { SwitchRHF } from '@/components/form/switch';
import { Modal } from '@/components/ui/modal';
import { useCompany } from '@/contexts';
import { DURATION_UNIT_OPTIONS, PLAN_TYPE_OPTIONS, TIER_OPTIONS, planFormSchema } from './plan-form.schema';
import { SavingsPreview } from './savings-preview';

type PlanFormProps = {
  isOpen: boolean;
  onSubmit: (data: PlanFormData) => Promise<void>;
  initialValues?: Partial<PlanFormData>;
  isSubmitting?: boolean;
  activeMembershipCount?: number;
};

const defaultValues: DefaultValues<PlanFormData> = {
  tiers: [],
  isActive: true,
};

const PlanForm = ({ isOpen, onSubmit, initialValues, isSubmitting = false, activeMembershipCount }: PlanFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';
  const { data: locations = [] } = useCompanyLocations({ companyId, activeOnly: true });

  const isEdit = !!initialValues;

  const values: DefaultValues<PlanFormData> = useMemo(
    () => (initialValues ? { ...defaultValues, ...initialValues } : defaultValues),
    [initialValues],
  );

  const methods = useForm<PlanFormData>({
    mode: 'onChange',
    resolver: zodResolver(planFormSchema),
    defaultValues: values,
  });

  const {
    control,
    watch,
    reset,
    register,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [reset, initialValues]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const planType = watch('type');

  const typeOptions = useMemo(
    () => PLAN_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
    [t],
  );

  const durationUnitOptions = useMemo(
    () => DURATION_UNIT_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
    [t],
  );

  const locationOptions = useMemo(() => locations.map((loc) => ({ value: loc.id, label: loc.name })), [locations]);

  const handleClose = () => {
    reset();
    navigate({ to: '/company/memberships' });
  };

  const handleFormSubmit = async (data: PlanFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={isEdit ? t('memberships.plans.editPlan') : t('memberships.plans.addPlan')}>
      <FormRHF methods={methods} onSubmit={handleFormSubmit} id="plan-form">
        <Modal.Body>
          <Stack gap={6}>
            {isEdit && !!activeMembershipCount && activeMembershipCount > 0 && (
              <Alert.Root status="warning">
                <Alert.Indicator />
                <Text fontSize="sm">
                  {t('memberships.plans.edit.activeMembershipsWarning', { count: activeMembershipCount })}
                </Text>
              </Alert.Root>
            )}

            {/* Section 1: Basic Information */}
            <Fieldset.Root>
              <Fieldset.Legend fontSize="sm" fontWeight="semibold" mb={2}>
                {t('memberships.plans.form.sectionBasicInfo')}
              </Fieldset.Legend>
              <Stack gap={4}>
                <InputRHF name="name" control={control} label={t('memberships.plans.form.name')} required />

                <FieldWrapperRHF name="description" label={t('memberships.plans.form.description')}>
                  <Textarea
                    placeholder={t('memberships.plans.form.descriptionPlaceholder')}
                    {...register('description')}
                    rows={3}
                  />
                </FieldWrapperRHF>

                <SelectRHF
                  name="type"
                  control={control}
                  label={t('memberships.plans.form.type')}
                  options={typeOptions}
                  required
                />

                <SelectRHF
                  name="locationId"
                  control={control}
                  label={t('memberships.plans.form.location')}
                  placeholder={t('memberships.plans.form.allLocations')}
                  options={locationOptions}
                />
              </Stack>
            </Fieldset.Root>

            {/* Section 2: Duration & Sessions */}
            <Fieldset.Root>
              <Fieldset.Legend fontSize="sm" fontWeight="semibold" mb={2}>
                {t('memberships.plans.form.sectionDuration')}
              </Fieldset.Legend>
              <Stack gap={4}>
                <HStack gap={4} align="flex-end">
                  <Box flex={1}>
                    <InputRHF
                      name="duration"
                      control={control}
                      label={t('memberships.plans.form.durationValue')}
                      type="number"
                      required
                    />
                  </Box>
                  <Box flex={1}>
                    <SelectRHF
                      name="durationUnit"
                      control={control}
                      label={t('memberships.plans.form.durationUnit')}
                      options={durationUnitOptions}
                      required
                    />
                  </Box>
                </HStack>

                {planType === 'sessions' && (
                  <InputRHF
                    name="sessionsCount"
                    control={control}
                    label={t('memberships.plans.form.sessionsCount')}
                    type="number"
                    required
                  />
                )}
              </Stack>
            </Fieldset.Root>

            {/* Section 3: Pricing */}
            <Fieldset.Root>
              <Fieldset.Legend fontSize="sm" fontWeight="semibold" mb={2}>
                {t('memberships.plans.form.sectionPricing')}
              </Fieldset.Legend>
              <Stack gap={4}>
                <InputRHF
                  name="price"
                  control={control}
                  label={t('memberships.plans.form.price')}
                  type="number"
                  required
                />

                <InputRHF
                  name="comparePrice"
                  control={control}
                  label={t('memberships.plans.form.comparePrice')}
                  helperText={t('memberships.plans.form.comparePriceHelper')}
                  type="number"
                />

                <SavingsPreview control={control} />
              </Stack>
            </Fieldset.Root>

            {/* Section 4: Access & Tiers */}
            <Fieldset.Root>
              <Fieldset.Legend fontSize="sm" fontWeight="semibold" mb={2}>
                {t('memberships.plans.form.sectionAccess')}
              </Fieldset.Legend>
              <CheckboxGroupRHF
                name="tiers"
                control={control}
                options={TIER_OPTIONS as unknown as { value: string; label: string }[]}
                helperText={t('memberships.plans.form.tiersHelper')}
              />
            </Fieldset.Root>

            {/* Section 5: Freeze Settings */}
            <Fieldset.Root>
              <Fieldset.Legend fontSize="sm" fontWeight="semibold" mb={2}>
                {t('memberships.plans.form.sectionFreeze')}
              </Fieldset.Legend>
              <Stack gap={4}>
                <InputRHF
                  name="maxFreezeDays"
                  control={control}
                  label={t('memberships.plans.form.maxFreezeDays')}
                  type="number"
                  required
                />
                <InputRHF
                  name="maxFreezeCount"
                  control={control}
                  label={t('memberships.plans.form.maxFreezeCount')}
                  type="number"
                  required
                />
              </Stack>
            </Fieldset.Root>

            {/* Section 6: Status */}
            <Fieldset.Root>
              <Fieldset.Legend fontSize="sm" fontWeight="semibold" mb={2}>
                {t('memberships.plans.form.sectionStatus')}
              </Fieldset.Legend>
              <SwitchRHF name="isActive" control={control} label={t('memberships.plans.form.isActive')} />
            </Fieldset.Root>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="plan-form" colorPalette="brand" loading={isSubmitting} disabled={!isDirty}>
            {isEdit ? t('common.save') : t('common.create')}
          </Button>
        </Modal.Footer>
      </FormRHF>
    </Modal>
  );
};

export { PlanForm };

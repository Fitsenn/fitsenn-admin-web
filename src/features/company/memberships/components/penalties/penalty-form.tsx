import type { DefaultValues } from 'react-hook-form';
import type { PenaltyFormData } from './penalty-form.schema';

import { useEffect, useMemo } from 'react';

import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { SelectRHF } from '@/components/form/select';
import { SwitchRHF } from '@/components/form/switch';
import { Modal } from '@/components/ui/modal';
import { useCompany } from '@/contexts';
import { useMembershipPlans } from '../../api/get-membership-plans';
import { TRIGGER_TYPE_OPTIONS, penaltyFormSchema } from './penalty-form.schema';

type PenaltyFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PenaltyFormData) => Promise<void>;
  initialValues?: Partial<PenaltyFormData>;
  isSubmitting?: boolean;
};

const defaultValues: DefaultValues<PenaltyFormData> = {
  name: '',
  triggerType: undefined,
  triggerCount: undefined,
  triggerWindowDays: undefined,
  banDays: undefined,
  planIds: [],
  isAllPlans: false,
};

const PenaltyForm = ({ isOpen, onClose, onSubmit, initialValues, isSubmitting = false }: PenaltyFormProps) => {
  const { t } = useTranslation();
  const isEdit = !!initialValues;
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';
  const { data: plans = [] } = useMembershipPlans(companyId);

  const values: DefaultValues<PenaltyFormData> = useMemo(
    () => (initialValues ? { ...defaultValues, ...initialValues } : defaultValues),
    [initialValues],
  );

  const methods = useForm<PenaltyFormData>({
    mode: 'onChange',
    resolver: zodResolver(penaltyFormSchema),
    defaultValues: values,
  });

  const {
    control,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = methods;

  // Reset form when initialValues change (edit mode)
  useEffect(() => {
    if (initialValues) {
      reset({ ...defaultValues, ...initialValues });
    }
  }, [reset, initialValues]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const isAllPlans = watch('isAllPlans');

  // Clear planIds when all plans is toggled on
  useEffect(() => {
    if (isAllPlans) {
      setValue('planIds', [], { shouldValidate: true });
    }
  }, [isAllPlans, setValue]);

  const triggerTypeOptions = useMemo(
    () => TRIGGER_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
    [t],
  );

  const planOptions = useMemo(() => plans.map((plan) => ({ value: plan.id, label: plan.name })), [plans]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = async (data: PenaltyFormData) => {
    await onSubmit(data);
    reset(defaultValues);
  };

  return (
    <Modal
      size="lg"
      open={isOpen}
      onClose={handleClose}
      title={isEdit ? t('memberships.penalties.editPenalty') : t('memberships.penalties.addPenalty')}>
      <FormRHF methods={methods} onSubmit={handleFormSubmit} id="penalty-form">
        <Modal.Body>
          <Stack gap={2}>
            <InputRHF name="name" control={control} label={t('memberships.penalties.form.name')} required />

            <HStack gap={4} align="flex-start">
              <Box flex={1}>
                <SelectRHF
                  name="triggerType"
                  control={control}
                  label={t('memberships.penalties.form.triggerType')}
                  options={triggerTypeOptions}
                  required
                />
              </Box>
              <Box flex={1}>
                <InputRHF
                  name="triggerCount"
                  control={control}
                  label={t('memberships.penalties.form.triggerCount')}
                  type="number"
                  required
                />
              </Box>
            </HStack>

            <HStack gap={4} align="flex-start">
              <Box flex={1}>
                <InputRHF
                  name="triggerWindowDays"
                  control={control}
                  label={t('memberships.penalties.form.triggerWindowDays')}
                  type="number"
                  required
                />
              </Box>
              <Box flex={1}>
                <InputRHF
                  name="banDays"
                  control={control}
                  label={t('memberships.penalties.form.banDays')}
                  type="number"
                  required
                />
              </Box>
            </HStack>

            <HStack gap={4} align="flex-start">
              <Box flex={3}>
                <SelectRHF
                  name="planIds"
                  control={control}
                  label={t('memberships.penalties.form.planIds')}
                  options={planOptions}
                  multiple
                  disabled={isAllPlans}
                />
              </Box>
              <Box flex={1} mt={10}>
                <SwitchRHF name="isAllPlans" control={control} label={t('memberships.penalties.form.isAllPlans')} />
              </Box>
            </HStack>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="penalty-form" colorPalette="brand" loading={isSubmitting} disabled={!isDirty}>
            {isEdit ? t('common.save') : t('common.create')}
          </Button>
        </Modal.Footer>
      </FormRHF>
    </Modal>
  );
};

export { PenaltyForm };

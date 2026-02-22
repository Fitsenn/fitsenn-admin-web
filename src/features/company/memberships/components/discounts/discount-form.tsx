import type { DefaultValues } from 'react-hook-form';
import type { DiscountFormData } from './discount-form.schema';

import { useEffect, useMemo } from 'react';

import { Button, HStack, Stack } from '@chakra-ui/react';
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
import { DISCOUNT_TYPE_OPTIONS, discountFormSchema } from './discount-form.schema';

type DiscountFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DiscountFormData) => Promise<void>;
  initialValues?: Partial<DiscountFormData>;
  isSubmitting?: boolean;
};

const defaultValues: DefaultValues<DiscountFormData> = {
  name: '',
  discountType: undefined,
  discountValue: undefined,
  planIds: [],
  isAllPlans: false,
  startsAt: '',
  endsAt: '',
  isIndefinite: false,
  isActive: true,
};

const DiscountForm = ({ isOpen, onClose, onSubmit, initialValues, isSubmitting = false }: DiscountFormProps) => {
  const { t } = useTranslation();
  const isEdit = !!initialValues;
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';
  const { data: plans = [] } = useMembershipPlans(companyId);

  const values: DefaultValues<DiscountFormData> = useMemo(
    () => (initialValues ? { ...defaultValues, ...initialValues } : defaultValues),
    [initialValues],
  );

  const methods = useForm<DiscountFormData>({
    mode: 'onChange',
    resolver: zodResolver(discountFormSchema),
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
  const isIndefinite = watch('isIndefinite');
  // eslint-disable-next-line react-hooks/incompatible-library
  const isAllPlans = watch('isAllPlans');

  // Clear endsAt when indefinite is toggled on
  useEffect(() => {
    if (isIndefinite) {
      setValue('endsAt', '', { shouldValidate: true });
    }
  }, [isIndefinite, setValue]);

  // Clear planIds when all plans is toggled on
  useEffect(() => {
    if (isAllPlans) {
      setValue('planIds', [], { shouldValidate: true });
    }
  }, [isAllPlans, setValue]);

  const discountTypeOptions = useMemo(
    () => DISCOUNT_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
    [t],
  );

  const planOptions = useMemo(() => plans.map((plan) => ({ value: plan.id, label: plan.name })), [plans]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = async (data: DiscountFormData) => {
    await onSubmit(data);
    reset(defaultValues);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={isEdit ? t('memberships.discounts.editDiscount') : t('memberships.discounts.addDiscount')}>
      <FormRHF methods={methods} onSubmit={handleFormSubmit} id="discount-form">
        <Modal.Body>
          <Stack gap={4}>
            <InputRHF name="name" control={control} label={t('memberships.discounts.form.name')} required />

            <SelectRHF
              name="discountType"
              control={control}
              label={t('memberships.discounts.form.discountType')}
              options={discountTypeOptions}
              required
            />

            <InputRHF
              name="discountValue"
              control={control}
              label={t('memberships.discounts.form.discountValue')}
              type="number"
              required
            />

            <HStack gap={4} align="flex-end">
              <SelectRHF
                name="planIds"
                control={control}
                label={t('memberships.discounts.form.planIds')}
                options={planOptions}
                multiple
                disabled={isAllPlans}
              />
              <SwitchRHF
                name="isAllPlans"
                control={control}
                label={t('memberships.discounts.form.isAllPlans')}
              />
            </HStack>

            <InputRHF
              name="startsAt"
              control={control}
              label={t('memberships.discounts.form.startsAt')}
              type="date"
              required
            />

            <HStack gap={4} align="flex-end">
              <InputRHF
                name="endsAt"
                control={control}
                label={t('memberships.discounts.form.endsAt')}
                type="date"
                disabled={isIndefinite}
              />
              <SwitchRHF
                name="isIndefinite"
                control={control}
                label={t('memberships.discounts.form.isIndefinite')}
              />
            </HStack>

            <SwitchRHF name="isActive" control={control} label={t('memberships.discounts.form.isActive')} />
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="discount-form" colorPalette="brand" loading={isSubmitting} disabled={!isDirty}>
            {isEdit ? t('common.save') : t('common.create')}
          </Button>
        </Modal.Footer>
      </FormRHF>
    </Modal>
  );
};

export { DiscountForm };

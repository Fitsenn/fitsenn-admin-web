import type { MembershipDiscount } from '@/types/company';
import type { DiscountFormData } from './discount-form.schema';

import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { transformers } from '@/utils/data-transformers';
import { useUpdateMembershipDiscount } from '../../api/update-membership-discount';
import { DiscountForm } from './discount-form';

type EditDiscountModalProps = {
  discount: MembershipDiscount | null;
  onClose: () => void;
};

const EditDiscountModal = ({ discount, onClose }: EditDiscountModalProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const updateMutation = useUpdateMembershipDiscount(companyId);

  const handleSubmit = async (data: DiscountFormData) => {
    if (!discount) return;

    const { isIndefinite, isAllPlans, ...rest } = data;
    const dbData = transformers.toDatabase({
      ...rest,
      planIds: isAllPlans ? null : rest.planIds,
      endsAt: isIndefinite ? null : rest.endsAt,
    });

    await updateMutation.mutateAsync(
      { discountId: discount.id, data: dbData },
      {
        onSuccess: () => {
          toaster.success({ title: t('memberships.discounts.update.success') });
          onClose();
        },
        onError: () => {
          toaster.error({ title: t('memberships.discounts.update.error') });
        },
      },
    );
  };

  const initialValues: DiscountFormData | undefined = useMemo(() => {
    if (!discount) return undefined;
    return {
      name: discount.name,
      discountType: discount.discountType as DiscountFormData['discountType'],
      discountValue: discount.discountValue,
      planIds: discount.planIds ?? [],
      isAllPlans: discount.planIds === null,
      startsAt: discount.startsAt ?? '',
      endsAt: discount.endsAt ?? '',
      isIndefinite: discount.endsAt === null,
      isActive: discount.isActive,
    };
  }, [discount]);

  return (
    <DiscountForm
      isOpen={!!discount}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      isSubmitting={updateMutation.isPending}
    />
  );
};

export { EditDiscountModal };

import type { DiscountFormData } from './discount-form.schema';

import { useTranslation } from 'react-i18next';

import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { transformers } from '@/utils/data-transformers';
import { useCreateMembershipDiscount } from '../../api/create-membership-discount';
import { DiscountForm } from './discount-form';

type CreateDiscountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateDiscountModal = ({ isOpen, onClose }: CreateDiscountModalProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const createMutation = useCreateMembershipDiscount();

  const handleSubmit = async (data: DiscountFormData) => {
    const { isIndefinite, isAllPlans, ...rest } = data;
    const dbData = transformers.toDatabase({
      companyId,
      ...rest,
      planIds: isAllPlans ? null : rest.planIds,
      endsAt: isIndefinite ? null : rest.endsAt,
    });

    await createMutation.mutateAsync(dbData, {
      onSuccess: () => {
        toaster.success({ title: t('memberships.discounts.create.success') });
        onClose();
      },
      onError: () => {
        toaster.error({ title: t('memberships.discounts.create.error') });
      },
    });
  };

  return <DiscountForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />;
};

export { CreateDiscountModal };

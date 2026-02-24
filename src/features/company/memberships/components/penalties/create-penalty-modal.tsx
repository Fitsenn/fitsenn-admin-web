import type { PenaltyFormData } from './penalty-form.schema';

import { useTranslation } from 'react-i18next';

import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { transformers } from '@/utils/data-transformers';
import { useCreateMembershipPenalty } from '../../api/create-membership-penalty';
import { PenaltyForm } from './penalty-form';

type CreatePenaltyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreatePenaltyModal = ({ isOpen, onClose }: CreatePenaltyModalProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const createMutation = useCreateMembershipPenalty();

  const handleSubmit = async (data: PenaltyFormData) => {
    const { isAllPlans, ...rest } = data;
    const dbData = transformers.toDatabase({
      companyId,
      ...rest,
      planIds: isAllPlans ? null : rest.planIds,
    });

    await createMutation.mutateAsync(dbData, {
      onSuccess: () => {
        toaster.success({ title: t('memberships.penalties.create.success') });
        onClose();
      },
      onError: () => {
        toaster.error({ title: t('memberships.penalties.create.error') });
      },
    });
  };

  return <PenaltyForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />;
};

export { CreatePenaltyModal };

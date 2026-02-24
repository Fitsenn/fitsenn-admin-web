import type { MembershipPlanPenalty } from '@/types/company';
import type { PenaltyFormData } from './penalty-form.schema';

import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { transformers } from '@/utils/data-transformers';
import { useUpdateMembershipPenalty } from '../../api/update-membership-penalty';
import { PenaltyForm } from './penalty-form';

type EditPenaltyModalProps = {
  penalty: MembershipPlanPenalty | null;
  onClose: () => void;
};

const EditPenaltyModal = ({ penalty, onClose }: EditPenaltyModalProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const updateMutation = useUpdateMembershipPenalty(companyId);

  const handleSubmit = async (data: PenaltyFormData) => {
    if (!penalty) return;

    const { isAllPlans, ...rest } = data;
    const dbData = transformers.toDatabase({
      ...rest,
      planIds: isAllPlans ? null : rest.planIds,
    });

    await updateMutation.mutateAsync(
      { penaltyId: penalty.id, data: dbData },
      {
        onSuccess: () => {
          toaster.success({ title: t('memberships.penalties.update.success') });
          onClose();
        },
        onError: () => {
          toaster.error({ title: t('memberships.penalties.update.error') });
        },
      },
    );
  };

  const initialValues: PenaltyFormData | undefined = useMemo(() => {
    if (!penalty) return undefined;
    return {
      name: penalty.name ?? '',
      triggerType: penalty.triggerType as PenaltyFormData['triggerType'],
      triggerCount: penalty.triggerCount,
      triggerWindowDays: penalty.triggerWindowDays,
      banDays: penalty.banDays,
      planIds: penalty.planIds ?? [],
      isAllPlans: penalty.planIds === null,
    };
  }, [penalty]);

  return (
    <PenaltyForm
      isOpen={!!penalty}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      isSubmitting={updateMutation.isPending}
    />
  );
};

export { EditPenaltyModal };

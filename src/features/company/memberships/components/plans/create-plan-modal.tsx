import type { PlanFormData } from './plan-form.schema';

import { useMatch, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { transformers } from '@/utils/data-transformers';
import { useCreateMembershipPlan } from '../../api/create-membership-plan';
import { PlanForm } from './plan-form';

const CreatePlanModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const match = useMatch({
    from: '/_authenticated/company/memberships/add',
    shouldThrow: false,
  });

  const isOpen = !!match;
  const createMutation = useCreateMembershipPlan();

  const handleSubmit = async (data: PlanFormData) => {
    const dbData = transformers.toDatabase({
      companyId,
      ...data,
      sessionsCount: data.type === 'sessions' ? (data.sessionsCount ?? null) : null,
    });

    await createMutation.mutateAsync(dbData, {
      onSuccess: () => {
        toaster.success({ title: t('memberships.plans.create.success') });
        navigate({ to: '/company/memberships' });
      },
      onError: () => {
        toaster.error({ title: t('memberships.plans.create.error') });
      },
    });
  };

  return <PlanForm isOpen={isOpen} onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />;
};

export { CreatePlanModal };

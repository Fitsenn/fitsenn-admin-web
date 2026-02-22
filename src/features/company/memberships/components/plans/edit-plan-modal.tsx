import type { PlanFormData } from './plan-form.schema';

import { useMemo } from 'react';

import { useMatch, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { transformers } from '@/utils/data-transformers';
import { useActiveMembershipCount } from '../../api/get-active-membership-count';
import { useMembershipPlans } from '../../api/get-membership-plans';
import { useUpdateMembershipPlan } from '../../api/update-membership-plan';
import { PlanForm } from './plan-form';

const EditPlanModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: plans = [] } = useMembershipPlans(companyId);

  const match = useMatch({
    from: '/_authenticated/company/memberships/$planId',
    shouldThrow: false,
  });

  const planId = match?.params?.planId;
  const isOpen = !!planId;
  const plan = planId ? plans.find((p) => p.id === planId) : null;

  const { data: activeMembershipCount = 0 } = useActiveMembershipCount(planId ?? '', isOpen);
  const updateMutation = useUpdateMembershipPlan(companyId);

  const handleSubmit = async (data: PlanFormData) => {
    if (!plan) return;

    const dbData = transformers.toDatabase({
      ...data,
      sessionsCount: data.type === 'sessions' ? (data.sessionsCount ?? null) : null,
    });

    await updateMutation.mutateAsync(
      { planId: plan.id, data: dbData },
      {
        onSuccess: () => {
          toaster.success({ title: t('memberships.plans.update.success') });
          navigate({ to: '/company/memberships' });
        },
        onError: () => {
          toaster.error({ title: t('memberships.plans.update.error') });
        },
      },
    );
  };

  const initialValues: PlanFormData | undefined = useMemo(() => {
    if (!plan) return undefined;
    return {
      name: plan.name,
      description: plan.description,
      type: plan.type as PlanFormData['type'],
      locationId: plan.locationId,
      duration: plan.duration,
      durationUnit: plan.durationUnit as PlanFormData['durationUnit'],
      sessionsCount: plan.sessionsCount,
      price: plan.price,
      comparePrice: plan.comparePrice,
      tiers: plan.tiers,
      maxFreezeDays: plan.maxFreezeDays ?? 0,
      maxFreezeCount: plan.maxFreezeCount ?? 0,
      isActive: plan.isActive,
    };
  }, [plan]);

  return (
    <PlanForm
      isOpen={isOpen}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      isSubmitting={updateMutation.isPending}
      activeMembershipCount={activeMembershipCount}
    />
  );
};

export { EditPlanModal };

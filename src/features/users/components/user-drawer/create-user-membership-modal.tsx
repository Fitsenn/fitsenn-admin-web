import type { DefaultValues } from 'react-hook-form';
import type { CreateUserMembershipFormData } from './user-membership-form.schema';

import { useEffect, useMemo } from 'react';

import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { SelectRHF } from '@/components/form/select';
import { SwitchRHF } from '@/components/form/switch';
import { Modal } from '@/components/ui/modal';
import { toaster } from '@/components/ui/toaster';
import { useMembershipPlans } from '@/features/company/memberships/api/get-membership-plans';
import { transformers } from '@/utils/data-transformers';
import { HARDCODED_COMPANY_ID } from '../../api/get-company-users';
import { useCreateUserMembership } from '../../api/create-user-membership';
import { createUserMembershipSchema } from './user-membership-form.schema';

type CreateUserMembershipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
};

const defaultValues: DefaultValues<CreateUserMembershipFormData> = {
  planId: undefined,
  startsAt: DateTime.now().toFormat('yyyy-MM-dd'),
  pricePaid: undefined,
  sessionsRemaining: undefined,
  autoRenew: false,
};

const calculateEndDate = (startsAt: string, duration: number, durationUnit: string): string => {
  return DateTime.fromISO(startsAt)
    .plus({ [durationUnit]: duration })
    .toISO()!;
};

const CreateUserMembershipModal = ({ isOpen, onClose, userId }: CreateUserMembershipModalProps) => {
  const { t } = useTranslation();
  const companyId = HARDCODED_COMPANY_ID;

  const { data: plans = [] } = useMembershipPlans(companyId);
  const createMutation = useCreateUserMembership();

  const methods = useForm<CreateUserMembershipFormData>({
    mode: 'onChange',
    resolver: zodResolver(createUserMembershipSchema),
    defaultValues,
  });

  const { control, reset, watch, setValue } = methods;

  const selectedPlanId = watch('planId');
  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId),
    [plans, selectedPlanId],
  );

  const isSessionBased = selectedPlan?.type === 'sessions';

  // Auto-populate price and sessions when plan changes
  useEffect(() => {
    if (selectedPlan) {
      setValue('pricePaid', selectedPlan.price);
      setValue(
        'sessionsRemaining',
        selectedPlan.type === 'sessions' ? selectedPlan.sessionsCount : null,
      );
    }
  }, [selectedPlan, setValue]);

  const planOptions = useMemo(
    () =>
      plans
        .filter((p) => p.isActive)
        .map((plan) => ({ value: plan.id, label: plan.name })),
    [plans],
  );

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleSubmit = async (data: CreateUserMembershipFormData) => {
    if (!selectedPlan) return;

    const endsAt = calculateEndDate(data.startsAt, selectedPlan.duration, selectedPlan.durationUnit);

    const dbData = transformers.toDatabase({
      userId,
      companyId,
      planId: data.planId,
      startsAt: data.startsAt,
      endsAt,
      pricePaid: data.pricePaid,
      sessionsRemaining: isSessionBased ? data.sessionsRemaining : null,
      autoRenew: data.autoRenew,
    });

    await createMutation.mutateAsync(dbData, {
      onSuccess: () => {
        toaster.success({ title: t('users.memberships.create.success') });
        handleClose();
      },
      onError: () => {
        toaster.error({ title: t('users.memberships.create.error') });
      },
    });
  };

  return (
    <Modal size="lg" open={isOpen} onClose={handleClose} title={t('users.memberships.addMembership')}>
      <FormRHF methods={methods} onSubmit={handleSubmit} id="create-user-membership-form">
        <Modal.Body>
          <Stack gap={2}>
            <SelectRHF
              name="planId"
              control={control}
              label={t('users.memberships.form.plan')}
              options={planOptions}
              required
            />
            <HStack gap={4} align="flex-start">
              <Box flex={1}>
                <InputRHF
                  name="startsAt"
                  control={control}
                  label={t('users.memberships.form.startDate')}
                  type="date"
                  required
                />
              </Box>
              <Box flex={1}>
                <InputRHF
                  name="pricePaid"
                  control={control}
                  label={t('users.memberships.form.pricePaid')}
                  type="number"
                  required
                />
              </Box>
            </HStack>
            {isSessionBased && (
              <InputRHF
                name="sessionsRemaining"
                control={control}
                label={t('users.memberships.form.sessionsRemaining')}
                type="number"
              />
            )}
            <SwitchRHF
              name="autoRenew"
              control={control}
              label={t('users.memberships.form.autoRenew')}
            />
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={handleClose} disabled={createMutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            form="create-user-membership-form"
            colorPalette="brand"
            loading={createMutation.isPending}
          >
            {t('common.create')}
          </Button>
        </Modal.Footer>
      </FormRHF>
    </Modal>
  );
};

export { CreateUserMembershipModal };

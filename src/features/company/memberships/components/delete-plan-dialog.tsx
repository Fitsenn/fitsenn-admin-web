import type { MembershipPlan } from '@/types/company';

import { Alert, Button, Spinner, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';
import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { useDeleteMembershipPlan } from '../api/delete-membership-plan';
import { useActiveMembershipCount } from '../api/get-active-membership-count';

type DeletePlanDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
};

const DeletePlanDialog = ({ isOpen, onClose, plan }: DeletePlanDialogProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: activeCount, isLoading: isCheckingCount } = useActiveMembershipCount(
    plan?.id ?? '',
    isOpen && !!plan,
  );

  const deleteMutation = useDeleteMembershipPlan(companyId);

  const handleConfirm = async () => {
    if (!plan) return;

    try {
      await deleteMutation.mutateAsync(plan.id);
      toaster.success({ title: t('memberships.plans.delete.success') });
      onClose();
    } catch {
      toaster.error({ title: t('memberships.plans.delete.error') });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={t('memberships.plans.delete.title')}>
      <Modal.Body>
        <Stack gap={4}>
          <Text>
            {t('memberships.plans.delete.confirm', { name: plan?.name })}
          </Text>

          {isCheckingCount && (
            <Stack direction="row" align="center" gap={2}>
              <Spinner size="xs" />
              <Text fontSize="sm" fontStyle="italic" color="fg.muted">
                {t('memberships.plans.delete.checking')}
              </Text>
            </Stack>
          )}

          {!isCheckingCount && activeCount != null && activeCount === 0 && (
            <Text fontSize="sm" fontStyle="italic" color="fg.muted">
              {t('memberships.plans.delete.noActiveUsers')}
            </Text>
          )}

          {!isCheckingCount && activeCount != null && activeCount > 0 && (
            <Alert.Root status="warning">
              <Alert.Indicator />
              <Stack gap={1}>
                <Alert.Title>{t('memberships.plans.delete.warningTitle')}</Alert.Title>
                <Alert.Description>
                  <Text fontSize="sm">
                    {t('memberships.plans.delete.activeMemberships', { count: activeCount })}
                  </Text>
                </Alert.Description>
              </Stack>
            </Alert.Root>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
          {t('common.cancel')}
        </Button>
        <Button
          colorPalette="red"
          onClick={handleConfirm}
          loading={deleteMutation.isPending}
          disabled={isCheckingCount}
        >
          {t('memberships.plans.delete.confirmButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { DeletePlanDialog };

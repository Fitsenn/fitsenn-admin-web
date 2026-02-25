import type { UserMembershipWithPlan } from '../../api/get-user-memberships';

import { Button, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';
import { toaster } from '@/components/ui/toaster';
import { HARDCODED_COMPANY_ID } from '../../api/get-company-users';
import { useDeleteUserMembership } from '../../api/delete-user-membership';

type DeleteUserMembershipDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  membership: UserMembershipWithPlan | null;
};

const DeleteUserMembershipDialog = ({ isOpen, onClose, membership }: DeleteUserMembershipDialogProps) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteUserMembership();

  const handleConfirm = async () => {
    if (!membership) return;

    try {
      await deleteMutation.mutateAsync({
        membershipId: membership.id,
        userId: membership.userId,
        companyId: HARDCODED_COMPANY_ID,
      });
      toaster.success({ title: t('users.memberships.delete.success') });
      onClose();
    } catch {
      toaster.error({ title: t('users.memberships.delete.error') });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={t('users.memberships.delete.title')}>
      <Modal.Body>
        <Stack gap={4}>
          <Text>
            {t('users.memberships.delete.confirm', { name: membership?.membershipPlans.name })}
          </Text>
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
        >
          {t('users.memberships.delete.confirmButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { DeleteUserMembershipDialog };

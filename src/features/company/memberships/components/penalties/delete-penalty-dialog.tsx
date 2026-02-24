import type { MembershipPlanPenalty } from '@/types/company';

import { Button, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';
import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { useDeleteMembershipPenalty } from '../../api/delete-membership-penalty';

type DeletePenaltyDialogProps = {
  penalty: MembershipPlanPenalty | null;
  onClose: () => void;
};

const DeletePenaltyDialog = ({ penalty, onClose }: DeletePenaltyDialogProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const deleteMutation = useDeleteMembershipPenalty(companyId);

  const handleConfirm = async () => {
    if (!penalty) return;

    try {
      await deleteMutation.mutateAsync(penalty.id);
      toaster.success({ title: t('memberships.penalties.delete.success') });
      onClose();
    } catch {
      toaster.error({ title: t('memberships.penalties.delete.error') });
    }
  };

  return (
    <Modal open={!!penalty} onClose={onClose} title={t('memberships.penalties.delete.title')}>
      <Modal.Body>
        <Text>
          {t('memberships.penalties.delete.confirm', { name: penalty?.name })}
        </Text>
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
          {t('memberships.penalties.delete.confirmButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { DeletePenaltyDialog };

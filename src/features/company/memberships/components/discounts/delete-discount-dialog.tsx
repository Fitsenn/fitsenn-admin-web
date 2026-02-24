import type { MembershipDiscount } from '@/types/company';

import { Button, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';
import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/contexts';
import { useDeleteMembershipDiscount } from '../../api/delete-membership-discount';

type DeleteDiscountDialogProps = {
  discount: MembershipDiscount | null;
  onClose: () => void;
};

const DeleteDiscountDialog = ({ discount, onClose }: DeleteDiscountDialogProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const deleteMutation = useDeleteMembershipDiscount(companyId);

  const handleConfirm = async () => {
    if (!discount) return;

    try {
      await deleteMutation.mutateAsync(discount.id);
      toaster.success({ title: t('memberships.discounts.delete.success') });
      onClose();
    } catch {
      toaster.error({ title: t('memberships.discounts.delete.error') });
    }
  };

  return (
    <Modal open={!!discount} onClose={onClose} title={t('memberships.discounts.delete.title')}>
      <Modal.Body>
        <Text>
          {t('memberships.discounts.delete.confirm', { name: discount?.name })}
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
          {t('memberships.discounts.delete.confirmButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { DeleteDiscountDialog };

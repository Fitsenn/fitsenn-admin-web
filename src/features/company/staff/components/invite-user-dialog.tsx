import type { InviteUserFormData } from './invite-user-form.schema';

import { Button, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { Modal } from '@/components/ui/modal';
import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/hooks/use-company';
import { useInviteUser } from '../api/invite-user';
import { inviteUserFormSchema } from './invite-user-form.schema';

type InviteUserDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const InviteUserDialog = ({ isOpen, onClose }: InviteUserDialogProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';
  const inviteMutation = useInviteUser(companyId);

  const methods = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserFormSchema),
    defaultValues: { email: '' },
  });

  const { control, reset } = methods;

  const onSubmit = async (data: InviteUserFormData) => {
    try {
      const result = await inviteMutation.mutateAsync({
        companyId,
        email: data.email,
      });

      if (result.status === 'added') {
        toaster.success({ title: t('companySettings.users.invite.addedSuccess') });
        reset();
        onClose();
      } else if (result.status === 'already_member') {
        toaster.warning({ title: t('companySettings.users.invite.alreadyMember') });
      } else if (result.status === 'not_found') {
        toaster.warning({ title: t('companySettings.users.invite.notFound') });
      }
    } catch {
      toaster.error({ title: t('companySettings.users.invite.inviteError') });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} title={t('companySettings.users.invite.title')}>
      <FormRHF methods={methods} onSubmit={onSubmit} id="invite-user-form">
        <Modal.Body>
          <Stack gap={4}>
            <InputRHF
              control={control}
              name="email"
              label={t('companySettings.users.invite.email')}
              placeholder={t('companySettings.users.invite.emailPlaceholder')}
              type="email"
              required
            />
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={handleClose} disabled={inviteMutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            form="invite-user-form"
            colorPalette="brand"
            loading={inviteMutation.isPending}
            loadingText={t('companySettings.users.invite.sending')}>
            {t('companySettings.users.invite.send')}
          </Button>
        </Modal.Footer>
      </FormRHF>
    </Modal>
  );
};

export { InviteUserDialog };

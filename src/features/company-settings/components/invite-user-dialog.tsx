import type { InviteUserFormData } from './invite-user-form.schema';

import { Button, Dialog, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InputRHF } from '@/components/form/input';
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

  const { control, handleSubmit, reset } = methods;

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
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="450px">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>{t('companySettings.users.invite.title')}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
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
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={handleClose} disabled={inviteMutation.isPending}>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  colorPalette="brand"
                  loading={inviteMutation.isPending}
                  loadingText={t('companySettings.users.invite.sending')}
                >
                  {t('companySettings.users.invite.send')}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export { InviteUserDialog };

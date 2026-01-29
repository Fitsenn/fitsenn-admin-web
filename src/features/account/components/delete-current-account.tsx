import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { DeleteAccountSection } from '@/components/ui/delete-account-section';
import { toaster } from '@/components/ui/toaster';
import { useDeleteAccount } from '../api/delete-account';

const DeleteCurrentAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const deleteAccountMutation = useDeleteAccount();

  const deleteAccount = () => {
    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/login' });
      },
      onError: () => {
        toaster.error({
          title: t('account.profileUpdateError'),
        });
      },
    });
  };

  return <DeleteAccountSection onDelete={deleteAccount} isPending={deleteAccountMutation.isPending} />;
};

export { DeleteCurrentAccount };

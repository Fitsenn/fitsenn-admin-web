import type { UserMembershipWithPlan } from '../../api/get-user-memberships';
import type { DefaultValues } from 'react-hook-form';
import type { EditUserMembershipFormData } from './user-membership-form.schema';

import { useEffect, useMemo } from 'react';

import { Button, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InputRHF } from '@/components/form/input';
import { SwitchRHF } from '@/components/form/switch';
import { FormRHF } from '@/components/form/form';
import { Modal } from '@/components/ui/modal';
import { toaster } from '@/components/ui/toaster';
import { transformers } from '@/utils/data-transformers';
import { HARDCODED_COMPANY_ID } from '../../api/get-company-users';
import { useUpdateUserMembership } from '../../api/update-user-membership';
import { editUserMembershipSchema } from './user-membership-form.schema';

type EditUserMembershipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  membership: UserMembershipWithPlan | null;
};

const defaultValues: DefaultValues<EditUserMembershipFormData> = {
  sessionsRemaining: undefined,
  endsAt: '',
  autoRenew: false,
};

const EditUserMembershipModal = ({ isOpen, onClose, membership }: EditUserMembershipModalProps) => {
  const { t } = useTranslation();
  const updateMutation = useUpdateUserMembership();

  const isSessionBased = membership?.membershipPlans.type === 'sessions';

  const initialValues: DefaultValues<EditUserMembershipFormData> = useMemo(() => {
    if (!membership) return defaultValues;
    return {
      sessionsRemaining: membership.sessionsRemaining,
      endsAt: DateTime.fromISO(membership.endsAt).toFormat('yyyy-MM-dd'),
      autoRenew: membership.autoRenew,
    };
  }, [membership]);

  const methods = useForm<EditUserMembershipFormData>({
    mode: 'onChange',
    resolver: zodResolver(editUserMembershipSchema),
    defaultValues: initialValues,
  });

  const {
    control,
    reset,
    formState: { isDirty },
  } = methods;

  // Reset form when membership changes
  useEffect(() => {
    if (membership) {
      reset({
        sessionsRemaining: membership.sessionsRemaining,
        endsAt: DateTime.fromISO(membership.endsAt).toFormat('yyyy-MM-dd'),
        autoRenew: membership.autoRenew,
      });
    }
  }, [membership, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleSubmit = async (data: EditUserMembershipFormData) => {
    if (!membership) return;

    const dbData = transformers.toDatabase({
      sessionsRemaining: isSessionBased ? data.sessionsRemaining : null,
      endsAt: data.endsAt,
      autoRenew: data.autoRenew,
    });

    await updateMutation.mutateAsync(
      {
        membershipId: membership.id,
        userId: membership.userId,
        companyId: HARDCODED_COMPANY_ID,
        data: dbData,
      },
      {
        onSuccess: () => {
          toaster.success({ title: t('users.memberships.update.success') });
          handleClose();
        },
        onError: () => {
          toaster.error({ title: t('users.memberships.update.error') });
        },
      },
    );
  };

  return (
    <Modal size="lg" open={isOpen} onClose={handleClose} title={t('users.memberships.editMembership')}>
      <FormRHF methods={methods} onSubmit={handleSubmit} id="edit-user-membership-form">
        <Modal.Body>
          <Stack gap={2}>
            {isSessionBased && (
              <InputRHF
                name="sessionsRemaining"
                control={control}
                label={t('users.memberships.form.sessionsRemaining')}
                type="number"
              />
            )}
            <InputRHF
              name="endsAt"
              control={control}
              label={t('users.memberships.form.endDate')}
              type="date"
              required
            />
            <SwitchRHF
              name="autoRenew"
              control={control}
              label={t('users.memberships.form.autoRenew')}
            />
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={handleClose} disabled={updateMutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            form="edit-user-membership-form"
            colorPalette="brand"
            loading={updateMutation.isPending}
            disabled={!isDirty}
          >
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </FormRHF>
    </Modal>
  );
};

export { EditUserMembershipModal };

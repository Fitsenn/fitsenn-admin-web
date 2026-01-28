import type { EditUserProfileFormData } from './edit-user-profile.schema';

import { useMemo } from 'react';

import { Button, Flex, SimpleGrid } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { toaster } from '@/components/ui/toaster';
import { HARDCODED_COMPANY_ID, useCompanyUser } from '../../api/get-company-users';
import { useUpdateUserProfile } from '../../api/update-user-profile';
import { editUserProfileSchema } from './edit-user-profile.schema';

const EditUserProfile = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { data: user } = useCompanyUser({
    companyId: HARDCODED_COMPANY_ID,
    userId,
  });
  const updateUserProfileMutation = useUpdateUserProfile();

  const values = useMemo(() => {
    return user
      ? {
          firstName: user.profile.first_name,
          lastName: user.profile.last_name,
          email: user.profile.email,
          phone: user.profile.phone,
        }
      : undefined;
  }, [user]);

  const methods = useForm<EditUserProfileFormData>({
    resolver: zodResolver(editUserProfileSchema),
    values,
  });

  const {
    control,
    formState: { isDirty },
  } = methods;

  const handleSubmit = (data: EditUserProfileFormData) => {
    updateUserProfileMutation.mutate(
      {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone ?? '',
      },
      {
        onSuccess: () => {
          toaster.success({ title: t('users.editProfile.updateSuccess') });
        },
        onError: () => {
          toaster.error({ title: t('users.editProfile.updateError') });
        },
      },
    );
  };

  return (
    <FormRHF methods={methods} onSubmit={handleSubmit}>
      <SimpleGrid columns={2} gapX={10} gapY={2}>
        <InputRHF control={control} name="firstName" label={t('users.editProfile.firstName')} required />
        <InputRHF control={control} name="lastName" label={t('users.editProfile.lastName')} required />
        <InputRHF control={control} name="email" label={t('users.editProfile.email')} required />
        <InputRHF control={control} name="phone" type="tel" label={t('users.editProfile.phone')} />
      </SimpleGrid>

      <Flex mt="4" justifyContent="flex-end">
        <Button
          type="submit"
          colorPalette="brand"
          alignSelf="flex-start"
          disabled={!isDirty}
          loading={updateUserProfileMutation.isPending}
          loadingText={t('users.editProfile.saving')}>
          {t('users.editProfile.save')}
        </Button>
      </Flex>
    </FormRHF>
  );
};

export { EditUserProfile };

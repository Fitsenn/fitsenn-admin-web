import type { EditUserProfileFormData } from './user-details-tab.schema';

import { useMemo } from 'react';

import { Box, Button, Flex, Separator, SimpleGrid, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { DeleteAccountSection } from '@/components/ui/delete-account-section';
import { toaster } from '@/components/ui/toaster';
import { usePermissions } from '@/contexts';
import { HARDCODED_COMPANY_ID, useCompanyUser } from '../../api/get-company-users';
import { useUpdateUserProfile } from '../../api/update-user-profile';
import { editUserProfileSchema } from './user-details-tab.schema';

const mockUserDetails = {
  joinDate: 'January 15, 2022',
  status: 'Member',
  lasLogin: 'June 10, 2024',
  registrationPoint: 'Mobile App',
  appVersion: '1.0.2',
};

const userDetailsLabels = {
  joinDate: 'users.editProfile.joinDate',
  status: 'Status',
  lasLogin: 'users.editProfile.lastLogin',
  registrationPoint: 'users.editProfile.registrationPoint',
  appVersion: 'users.editProfile.appVersion',
};

const EditUserProfile = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const canEdit = hasPermission('users', 'write');
  const canDelete = hasPermission('users', 'delete');

  const updateUserProfileMutation = useUpdateUserProfile();
  const { data: user } = useCompanyUser({
    companyId: HARDCODED_COMPANY_ID,
    userId,
  });

  const values = useMemo(() => {
    return user
      ? {
          firstName: user.profile.firstName ?? '',
          lastName: user.profile.lastName ?? '',
          email: user.profile.email,
          phone: user.profile.phone ?? undefined,
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

  const deleteAccount = () => {
    console.log('Deleting account');
    navigate({ to: '/users' });
  };

  return (
    <>
      <Flex gap={8} flexDirection={{ base: 'column', md: 'row' }}>
        <Box bgColor={{ base: 'white', _dark: 'gray.900' }} borderRadius="xl" boxShadow="subtle" flex={2}>
          <FormRHF methods={methods} onSubmit={handleSubmit}>
            <Flex alignItems="center" justifyContent="space-between" px={6} h="70px">
              <Text textStyle="md" fontWeight="bold">
                Personal information
              </Text>
              <Button
                size="xs"
                type="submit"
                colorPalette="brand"
                disabled={!canEdit || !isDirty}
                loading={updateUserProfileMutation.isPending}
                loadingText={t('users.editProfile.saving')}>
                {t('users.editProfile.save')}
              </Button>
            </Flex>
            <Separator />
            <SimpleGrid columns={{ base: 1, md: 2 }} gapX={10} gapY={2} p={6}>
              <InputRHF
                control={control}
                name="firstName"
                label={t('users.editProfile.firstName')}
                required
                size="sm"
                disabled={!canEdit}
              />
              <InputRHF control={control} name="lastName" label={t('users.editProfile.lastName')} required size="sm" disabled={!canEdit} />
              <InputRHF control={control} name="email" label={t('users.editProfile.email')} required size="sm" disabled={!canEdit} />
              <InputRHF control={control} name="phone" type="tel" label={t('users.editProfile.phone')} size="sm" disabled={!canEdit} />
            </SimpleGrid>
          </FormRHF>
        </Box>

        <Box bgColor={{ base: 'white', _dark: 'gray.900' }} borderRadius="xl" boxShadow="subtle" flex={1}>
          <Text textStyle="md" fontWeight="bold" px={6} lineHeight="70px">
            Account information
          </Text>
          <Separator />
          <Flex direction="column" gap={3} p={6}>
            {Object.entries(mockUserDetails).map(([key, value]) => (
              <Flex key={key} justifyContent="space-between">
                <Text color="fg.muted">{t(userDetailsLabels[key as keyof typeof userDetailsLabels])}</Text>
                <Text fontWeight="medium">{value}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>

      <Box mt="6" />
      <DeleteAccountSection onDelete={deleteAccount} isPending={false} disabled={!canDelete} />
    </>
  );
};

export { EditUserProfile };

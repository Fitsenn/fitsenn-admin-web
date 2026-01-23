import type { ProfileFormData } from './profile-form.schema';

import { useEffect } from 'react';

import { Box, Button, Fieldset, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldWrapperRHF } from '@/components/form/field-wrapper';
import { FormRHF } from '@/components/form/form';
import { toaster } from '@/components/ui/toaster';
import { useUser } from '@/hooks/use-user';
import { useUpdateProfile } from '../api/update-profile';
import { profileFormSchema } from './profile-form.schema';

const ProfileForm = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const updateProfileMutation = useUpdateProfile();

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.first_name ?? '',
      lastName: user?.last_name ?? '',
      phone: user?.phone ?? '',
    },
  });

  useEffect(() => {
    if (user) {
      methods.reset({
        firstName: user.first_name ?? '',
        lastName: user.last_name ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user, methods]);

  const handleSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? '',
      },
      {
        onSuccess: () => {
          toaster.success({
            title: t('account.profileUpdated'),
          });
        },
        onError: () => {
          toaster.error({
            title: t('account.profileUpdateError'),
          });
        },
      },
    );
  };

  return (
    <Box bg={{ base: 'gray.50', _dark: 'gray.900' }} p={6} borderRadius="lg">
      <Fieldset.Root>
        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={2}>
          {t('account.myProfile')}
        </Fieldset.Legend>
        <Text color="fg.muted" mb={4}>
          {t('account.profileDescription')}
        </Text>
        <Fieldset.Content>
          <FormRHF methods={methods} onSubmit={handleSubmit}>
            <Stack gap={4}>
              <FieldWrapperRHF<ProfileFormData> name="firstName" label={t('account.firstName')} required>
                <Input {...methods.register('firstName')} />
              </FieldWrapperRHF>

              <FieldWrapperRHF<ProfileFormData> name="lastName" label={t('account.lastName')} required>
                <Input {...methods.register('lastName')} />
              </FieldWrapperRHF>

              <FieldWrapperRHF<ProfileFormData> name="phone" label={t('account.phone')}>
                <Input {...methods.register('phone')} type="tel" />
              </FieldWrapperRHF>

              <Box>
                <Text fontWeight="medium" mb={1}>
                  {t('account.email')}
                </Text>
                <Input value={user?.email ?? ''} disabled />
                <Text color="fg.muted" fontSize="sm" mt={1}>
                  Email cannot be changed
                </Text>
              </Box>

              <Button
                type="submit"
                colorPalette="brand"
                alignSelf="flex-start"
                loading={updateProfileMutation.isPending}
                loadingText={t('account.saving')}>
                {t('account.saveChanges')}
              </Button>
            </Stack>
          </FormRHF>
        </Fieldset.Content>
      </Fieldset.Root>
    </Box>
  );
};

export { ProfileForm };

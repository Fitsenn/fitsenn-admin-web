import { Box, Button, Fieldset, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldWrapperRHF } from '@/components/form/field-wrapper';
import { FormRHF } from '@/components/form/form';
import { toaster } from '@/components/ui/toaster';

import { useUpdatePassword } from '../api/update-password';

import { changePasswordFormSchema } from './change-password-form.schema';

import type { ChangePasswordFormData } from './change-password-form.schema';

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const updatePasswordMutation = useUpdatePassword();

  const methods = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = (data: ChangePasswordFormData) => {
    updatePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toaster.success({
            title: t('account.passwordUpdated'),
          });
          methods.reset();
        },
        onError: (error) => {
          toaster.error({
            title: t('account.passwordUpdateError'),
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Box bg={{ base: 'gray.50', _dark: 'gray.900' }} p={6} borderRadius="lg">
      <Fieldset.Root>
        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={2}>
          {t('account.changePassword')}
        </Fieldset.Legend>
        <Text color="fg.muted" mb={4}>
          {t('account.changePasswordDescription')}
        </Text>
        <Fieldset.Content>
          <FormRHF methods={methods} onSubmit={handleSubmit}>
            <Stack gap={4}>
              <FieldWrapperRHF<ChangePasswordFormData>
                name="currentPassword"
                label={t('account.currentPassword')}
                required>
                <Input {...methods.register('currentPassword')} type="password" />
              </FieldWrapperRHF>

              <FieldWrapperRHF<ChangePasswordFormData> name="newPassword" label={t('account.newPassword')} required>
                <Input {...methods.register('newPassword')} type="password" />
              </FieldWrapperRHF>

              <FieldWrapperRHF<ChangePasswordFormData>
                name="confirmPassword"
                label={t('account.confirmPassword')}
                required>
                <Input {...methods.register('confirmPassword')} type="password" />
              </FieldWrapperRHF>

              <Button
                type="submit"
                colorPalette="brand"
                alignSelf="flex-start"
                loading={updatePasswordMutation.isPending}
                loadingText={t('account.updatingPassword')}>
                {t('account.updatePassword')}
              </Button>
            </Stack>
          </FormRHF>
        </Fieldset.Content>
      </Fieldset.Root>
    </Box>
  );
};

export { ChangePasswordForm };

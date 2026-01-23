import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { ChangePasswordForm } from './change-password-form';
import { DeleteAccountSection } from './delete-account-section';
import { ProfileForm } from './profile-form';

const AccountPage = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('account.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('account.description')}
        </Text>
      </Box>

      <Stack gap={8}>
        <ProfileForm />
        <ChangePasswordForm />
        <DeleteAccountSection />
      </Stack>
    </Stack>
  );
};

export { AccountPage };

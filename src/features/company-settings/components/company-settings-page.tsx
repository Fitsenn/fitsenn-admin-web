import { Box, Heading, Stack, Tabs, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { GeneralTab } from './general-tab';
import { UsersTab } from './users-tab';

const CompanySettingsPage = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('companySettings.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('companySettings.description')}
        </Text>
      </Box>
      <Tabs.Root defaultValue="general">
        <Tabs.List>
          <Tabs.Trigger value="general">{t('companySettings.tabs.general')}</Tabs.Trigger>
          <Tabs.Trigger value="users">{t('companySettings.tabs.users')}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="general">
          <GeneralTab />
        </Tabs.Content>
        <Tabs.Content value="users">
          <UsersTab />
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
};

export { CompanySettingsPage };

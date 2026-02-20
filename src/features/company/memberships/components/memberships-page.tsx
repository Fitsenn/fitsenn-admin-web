import { Box, Heading, Stack, Tabs, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { PlansTable } from './plans-table';

const MembershipsPage = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('memberships.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('memberships.description')}
        </Text>
      </Box>
      <Tabs.Root defaultValue="plans">
        <Tabs.List>
          <Tabs.Trigger value="plans">{t('memberships.tabs.plans')}</Tabs.Trigger>
          <Tabs.Trigger value="discounts">{t('memberships.tabs.discounts')}</Tabs.Trigger>
          <Tabs.Trigger value="penalties">{t('memberships.tabs.penalties')}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="plans">
          <PlansTable />
        </Tabs.Content>
        <Tabs.Content value="discounts">{/* Discounts tab content */}</Tabs.Content>
        <Tabs.Content value="penalties">{/* Penalties tab content */}</Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
};

export { MembershipsPage };

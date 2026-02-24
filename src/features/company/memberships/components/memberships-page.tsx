import { Box, Heading, Stack, Tabs, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { DiscountsTable } from './discounts/discounts-table';
import { PenaltiesTable } from './penalties/penalties-table';
import { PlansTable } from './plans/plans-table';

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
        <Tabs.Content value="discounts">
          <DiscountsTable />
        </Tabs.Content>
        <Tabs.Content value="penalties">
          <PenaltiesTable />
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
};

export { MembershipsPage };

import { Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUser } from '@/hooks/use-user';

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('dashboard.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('dashboard.welcomeBack', { firstName: user?.first_name, lastName: user?.last_name })}
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        <StatCard title={t('dashboard.totalUsers')} value="1,234" />
        <StatCard title={t('dashboard.activeSessions')} value="856" />
        <StatCard title={t('dashboard.revenue')} value="$12,345" />
        <StatCard title={t('dashboard.growth')} value="+12.5%" />
      </SimpleGrid>

      <Box bg="bg.panel" p={6} borderRadius="lg">
        <Heading size="md" mb={4}>
          {t('dashboard.recentActivity')}
        </Heading>
        <Text color="fg.muted">{t('dashboard.noRecentActivity')}</Text>
      </Box>
    </Stack>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Box bg="bg.panel" p={6} borderRadius="lg" boxShadow="sm">
      <Text fontSize="sm" color="fg.muted" mb={2}>
        {title}
      </Text>
      <Heading size="lg">{value}</Heading>
    </Box>
  );
}

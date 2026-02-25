import { Box, Heading, SimpleGrid, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useCompany, useUser } from '@/contexts';

import { useDashboardStats } from '../api/get-dashboard-stats';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { selectedCompany } = useCompany();
  const { data: stats, isLoading } = useDashboardStats(selectedCompany?.id ?? '');

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('dashboard.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('dashboard.welcomeBack', { firstName: user?.firstName, lastName: user?.lastName })}
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCard
          title={t('dashboard.totalUsers')}
          value={stats?.totalUsers.toLocaleString()}
          isLoading={isLoading}
        />
        <StatCard
          title={t('dashboard.activeMemberships')}
          value={stats?.activeMemberships.toLocaleString()}
          isLoading={isLoading}
        />
        <StatCard
          title={t('dashboard.revenue')}
          value={stats ? formatCurrency(stats.revenue) : undefined}
          isLoading={isLoading}
        />
      </SimpleGrid>

      <Box bg="bg.panel" p={6} borderRadius="lg">
        <Heading size="md" mb={4}>
          {t('dashboard.recentActivity')}
        </Heading>
        <Text color="fg.muted">{t('dashboard.noRecentActivity')}</Text>
      </Box>
    </Stack>
  );
};

type StatCardProps = {
  title: string;
  value: string | undefined;
  isLoading: boolean;
};

const StatCard = ({ title, value, isLoading }: StatCardProps) => {
  return (
    <Box bg="bg.panel" p={6} borderRadius="lg" boxShadow="sm">
      <Text fontSize="sm" color="fg.muted" mb={2}>
        {title}
      </Text>
      {isLoading ? (
        <Skeleton height="32px" width="80px" />
      ) : (
        <Heading size="lg">{value}</Heading>
      )}
    </Box>
  );
};

export { DashboardPage };

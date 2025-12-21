import { Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

export function DashboardPage() {
  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">Dashboard</Heading>
        <Text color="fg.muted" mt={2}>
          Welcome to your admin dashboard
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        <StatCard title="Total Users" value="1,234" />
        <StatCard title="Active Sessions" value="856" />
        <StatCard title="Revenue" value="$12,345" />
        <StatCard title="Growth" value="+12.5%" />
      </SimpleGrid>

      <Box bg="bg.panel" p={6} borderRadius="lg">
        <Heading size="md" mb={4}>
          Recent Activity
        </Heading>
        <Text color="fg.muted">No recent activity to display</Text>
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

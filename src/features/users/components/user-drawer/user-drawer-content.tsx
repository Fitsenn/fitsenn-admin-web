import { Badge, Box, Flex, Image, Tabs, Text } from '@chakra-ui/react';
import { LuMail, LuPhone } from 'react-icons/lu';

import { HARDCODED_COMPANY_ID, useCompanyUser } from '../../api/get-company-users';
import { EditUserProfile } from './user-details-tab';

const UserDrawerContent = ({ userId }: { userId: string }) => {
  const { data: user } = useCompanyUser({
    companyId: HARDCODED_COMPANY_ID,
    userId,
  });

  return (
    <Box p="4">
      {/* Header */}
      <Flex alignItems="center" gap="4">
        <Image src={user?.profile.avatar_url ?? ''} rounded="xl" boxSize={{ base: '100px', md: '150px' }} />
        <Flex direction="column" gap="1">
          <Flex alignItems="center" gap="2" mb="2" flexWrap="wrap">
            <Text fontSize="2xl" fontWeight="bold">
              {user?.profile.first_name} {user?.profile.last_name}
            </Text>
            <Badge colorPalette={user?.membership ? 'green' : 'orange'}>
              {user?.membership ? 'Active Member' : 'Inactive Member'}
            </Badge>
          </Flex>
          <Flex alignItems="center" gap="2">
            <LuPhone />
            <Text>{user?.profile.phone}</Text>
          </Flex>
          <Flex alignItems="center" gap="2">
            <LuMail />
            <Text>{user?.profile.email}</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Tabs */}
      <Tabs.Root defaultValue="overview" mt="6">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="membership">Membership</Tabs.Trigger>
          <Tabs.Trigger value="transactions">Transactions</Tabs.Trigger>
          <Tabs.Trigger value="edit-profile">Details</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">Manage your team members</Tabs.Content>
        <Tabs.Content value="membership">Manage your projects</Tabs.Content>
        <Tabs.Content value="transactions">Manage your tasks for freelancers</Tabs.Content>
        <Tabs.Content value="edit-profile">
          <EditUserProfile userId={userId} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export { UserDrawerContent };

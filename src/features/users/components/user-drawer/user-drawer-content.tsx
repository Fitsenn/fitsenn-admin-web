import { Badge, Box, Flex, Image, Tabs, Text } from '@chakra-ui/react';
import { Mail, Phone } from 'lucide-react';

import { HARDCODED_COMPANY_ID, useCompanyUser } from '../../api/get-company-users';
import { EditUserProfile } from './user-details-tab';
import { UserMembershipsTab } from './user-memberships-tab';

const UserDrawerContent = ({ userId }: { userId: string }) => {
  const { data: user } = useCompanyUser({
    companyId: HARDCODED_COMPANY_ID,
    userId,
  });

  return (
    <Box p="4">
      {/* Header */}
      <Flex alignItems="center" gap="4">
        <Image src={user?.profile.avatarUrl ?? ''} rounded="xl" boxSize={{ base: '100px', md: '150px' }} />
        <Flex direction="column" gap="1">
          <Flex alignItems="center" gap="2" mb="2" flexWrap="wrap">
            <Text fontSize="2xl" fontWeight="bold">
              {user?.profile.firstName} {user?.profile.lastName}
            </Text>
            <Badge colorPalette={user?.membership ? 'green' : 'orange'}>
              {user?.membership ? 'Active Member' : 'Inactive Member'}
            </Badge>
          </Flex>
          <Flex alignItems="center" gap="2">
            <Phone size={16} />
            <Text>{user?.profile.phone}</Text>
          </Flex>
          <Flex alignItems="center" gap="2">
            <Mail size={16} />
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
        <Tabs.Content value="membership">
          <UserMembershipsTab userId={userId} />
        </Tabs.Content>
        <Tabs.Content value="transactions">Manage your tasks for freelancers</Tabs.Content>
        <Tabs.Content value="edit-profile">
          <EditUserProfile userId={userId} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export { UserDrawerContent };

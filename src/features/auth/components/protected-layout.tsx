import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';

import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

const ProtectedLayout = () => {
  // TODO: Get user from auth context/query
  const user = null;

  return (
    <Flex minH="100vh">
      <Sidebar />
      <Flex direction="column" flex={1}>
        <Navbar user={user} />
        <Box flex={1} p={8} overflow="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export { ProtectedLayout };

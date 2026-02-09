import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';

import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { CompanyProvider, LocationProvider, UserProvider } from '@/contexts';

const ProtectedLayout = () => {
  return (
    <UserProvider>
      <CompanyProvider>
        <LocationProvider>
          <Flex minH="100vh">
            <Sidebar />
            <Flex direction="column" flex={1}>
              <Navbar />
              <Box flex={1} p={8} overflow="auto">
                <Outlet />
              </Box>
            </Flex>
          </Flex>
        </LocationProvider>
      </CompanyProvider>
    </UserProvider>
  );
};

export { ProtectedLayout };

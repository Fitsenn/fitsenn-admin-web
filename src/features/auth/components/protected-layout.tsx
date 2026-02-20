import { Suspense } from 'react';

import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';

import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { CompanyProvider, LocationProvider, PermissionsProvider, UserProvider } from '@/contexts';

const FullScreenLoader = () => (
  <Center minH="100vh">
    <Spinner size="xl" colorPalette="brand" />
  </Center>
);

const ProtectedLayout = () => {
  return (
    <UserProvider>
      <Suspense fallback={<FullScreenLoader />}>
        <CompanyProvider>
          <PermissionsProvider>
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
          </PermissionsProvider>
        </CompanyProvider>
      </Suspense>
    </UserProvider>
  );
};

export { ProtectedLayout };

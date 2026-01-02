import { Box, Container } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';

import { Navbar } from '@/components/layout/navbar';

export function ProtectedLayout() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Container maxW="7xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
}

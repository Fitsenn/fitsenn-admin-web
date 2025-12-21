import { Box, Button, Container, Flex, HStack } from '@chakra-ui/react';
import { Link, Outlet } from '@tanstack/react-router';

export function ProtectedLayout() {
  return (
    <Box minH="100vh">
      <Box as="nav" bg="bg.panel" borderBottomWidth="1px" py={4}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <HStack gap={4}>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/users">
                <Button variant="ghost">Users</Button>
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
}

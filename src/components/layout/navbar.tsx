import { Box, Flex, Heading, HStack } from '@chakra-ui/react';

import { ColorModeButton } from '@/components/ui/color-mode-button';

import { ProfileDropdown } from './profile-dropdown';

type NavbarProps = {
  user?: {
    name?: string | null;
    avatar?: string | null;
  } | null;
};

const Navbar = ({ user = null }: NavbarProps) => {
  return (
    <Box as="nav" bg="bg.panel" borderBottomWidth="1px" py={3} px={6}>
      <Flex justify="space-between" align="center">
        <Heading size="md" fontWeight="semibold">
          Page title
        </Heading>
        <HStack gap={2}>
          <ColorModeButton />
          <ProfileDropdown user={user} />
        </HStack>
      </Flex>
    </Box>
  );
};

export { Navbar };

import { Box, Flex, HStack, Heading } from '@chakra-ui/react';

import { ColorModeButton } from '@/components/ui/color-mode-button';
import { CompanyDropdown } from './company-dropdown';
import { LocationDropdown } from './location-dropdown';
import { ProfileDropdown } from './profile-dropdown';

const Navbar = () => {
  return (
    <Box as="nav" bg="bg.panel" borderBottomWidth="1px" py={3} px={6}>
      <Flex justify="space-between" align="center">
        <Heading size="md" fontWeight="semibold">
          Page title
        </Heading>
        <HStack gap={2}>
          <CompanyDropdown />
          <LocationDropdown />
          <ColorModeButton />
          <ProfileDropdown />
        </HStack>
      </Flex>
    </Box>
  );
};

export { Navbar };

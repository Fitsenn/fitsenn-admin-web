import type { FileRouteTypes } from '@/routeTree.gen';
import type { ReactNode } from 'react';

import { useState } from 'react';

import { Box, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Building2, ChevronLeft, ChevronRight, House, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type SidebarItem = {
  labelKey: string;
  to: FileRouteTypes['to'];
  icon: ReactNode;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    labelKey: 'navigation.dashboard',
    to: '/dashboard',
    icon: <House />,
  },
  {
    labelKey: 'navigation.locations',
    to: '/locations',
    icon: <MapPin />,
  },
  {
    labelKey: 'navigation.users',
    to: '/users',
    icon: <Users />,
  },
  {
    labelKey: 'navigation.companySettings',
    to: '/company-settings',
    icon: <Building2 />,
  },
];

const SIDEBAR_WIDTH_EXPANDED = '240px';
const SIDEBAR_WIDTH_COLLAPSED = '72px';

const Sidebar = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <Box
      as="aside"
      h="100vh"
      w={isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED}
      bg="bg.panel"
      borderRightWidth="1px"
      position="sticky"
      top={0}
      left={0}
      transition="width 0.2s ease"
      flexShrink={0}>
      <Flex direction="column" h="full" py={4}>
        <Flex px={4} mb={6} align="center" justify={isCollapsed ? 'center' : 'space-between'}>
          {!isCollapsed && (
            <Text fontWeight="bold" fontSize="xl">
              Fitsenn
            </Text>
          )}
          <Box as="button" onClick={toggleSidebar} p={2} borderRadius="md" _hover={{ bg: 'bg.muted' }} cursor="pointer">
            <Icon boxSize={5}>{isCollapsed ? <ChevronRight /> : <ChevronLeft />}</Icon>
          </Box>
        </Flex>

        <VStack gap={1} px={3} align="stretch">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = currentPath.includes(item.to);

            return (
              <Link key={item.to} to={item.to}>
                <Flex
                  align="center"
                  gap={3}
                  px={3}
                  py={3}
                  borderRadius="lg"
                  bg={isActive ? 'brand.solid' : 'transparent'}
                  color={isActive ? 'brand.contrast' : 'fg.default'}
                  _hover={{
                    bg: isActive ? 'brand.solid' : 'bg.muted',
                  }}
                  transition="all 0.15s ease"
                  justify={isCollapsed ? 'center' : 'flex-start'}>
                  <Icon boxSize={5}>{item.icon}</Icon>
                  {!isCollapsed && <Text fontWeight={isActive ? 'semibold' : 'medium'}>{t(item.labelKey)}</Text>}
                </Flex>
              </Link>
            );
          })}
        </VStack>
      </Flex>
    </Box>
  );
};

export { Sidebar };

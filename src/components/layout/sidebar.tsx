import type { SidebarItem } from './sidebar.types';

import { useMemo, useState } from 'react';

import { Box, Collapsible, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { usePermissions } from '@/contexts';

import { QuickActions } from './quick-actions';
import { SIDEBAR_ITEMS } from './sidebar.utils';

const SIDEBAR_WIDTH_EXPANDED = '240px';
const SIDEBAR_WIDTH_COLLAPSED = '72px';

const Sidebar = () => {
  const { t } = useTranslation();
  const { permissions } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const visibleItems = useMemo(() => {
    return SIDEBAR_ITEMS.reduce<SidebarItem[]>((acc, item) => {
      if (item.permission && !permissions.includes(item.permission)) {
        return acc;
      }

      if (item.type === 'group') {
        const visibleChildren = item.children.filter(
          (child) => !child.permission || permissions.includes(child.permission),
        );
        if (visibleChildren.length === 0) return acc;
        acc.push({ ...item, children: visibleChildren });
        return acc;
      }

      acc.push(item);
      return acc;
    }, []);
  }, [permissions]);

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

        <QuickActions isCollapsed={isCollapsed} />

        <VStack gap={1} px={3} align="stretch">
          {visibleItems.map((item) => {
            if (item.type === 'link') {
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
            }

            const isGroupActive = item.children.some((child) => currentPath.startsWith(child.to));

            const handleGroupClick = () => {
              if (isCollapsed) {
                setIsCollapsed(false);
              }
            };

            return (
              <Collapsible.Root key={item.labelKey} defaultOpen={isGroupActive}>
                <Collapsible.Trigger asChild onClick={handleGroupClick}>
                  <Flex
                    align="center"
                    gap={3}
                    px={3}
                    py={3}
                    borderRadius="lg"
                    bg={isGroupActive ? 'brand.solid/10' : 'transparent'}
                    color={isGroupActive ? 'brand.solid' : 'fg.default'}
                    _hover={{ bg: isGroupActive ? 'brand.solid/10' : 'bg.muted' }}
                    transition="all 0.15s ease"
                    justify={isCollapsed ? 'center' : 'space-between'}
                    cursor="pointer">
                    <Flex align="center" gap={3}>
                      <Icon boxSize={5}>{item.icon}</Icon>
                      {!isCollapsed && (
                        <Text fontWeight={isGroupActive ? 'semibold' : 'medium'}>{t(item.labelKey)}</Text>
                      )}
                    </Flex>
                    {!isCollapsed && (
                      <Icon
                        boxSize={4}
                        transition="transform 0.2s ease"
                        css={{ '[data-state=open] &': { transform: 'rotate(180deg)' } }}>
                        <ChevronDown />
                      </Icon>
                    )}
                  </Flex>
                </Collapsible.Trigger>
                {!isCollapsed && (
                  <Collapsible.Content>
                    <VStack gap={1} pl={8} mt={1} align="stretch">
                      {item.children.map((child) => {
                        const isChildActive = currentPath.startsWith(child.to);

                        return (
                          <Link key={child.to} to={child.to}>
                            <Flex
                              align="center"
                              gap={3}
                              px={3}
                              py={2}
                              borderRadius="lg"
                              bg={isChildActive ? 'brand.solid' : 'transparent'}
                              color={isChildActive ? 'brand.contrast' : 'fg.default'}
                              _hover={{ bg: isChildActive ? 'brand.solid' : 'bg.muted' }}
                              transition="all 0.15s ease">
                              {child.icon && <Icon boxSize={4}>{child.icon}</Icon>}
                              <Text fontSize="sm" fontWeight={isChildActive ? 'semibold' : 'medium'}>
                                {t(child.labelKey)}
                              </Text>
                            </Flex>
                          </Link>
                        );
                      })}
                    </VStack>
                  </Collapsible.Content>
                )}
              </Collapsible.Root>
            );
          })}
        </VStack>
      </Flex>
    </Box>
  );
};

export { Sidebar };

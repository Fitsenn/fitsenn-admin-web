import type { FlatSidebarItem } from './sidebar.types';

import { useCallback, useMemo, useState } from 'react';

import { Box, Flex, Icon, IconButton, Text, VStack } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { usePermissions } from '@/contexts';
import { useLocalStorage } from '@/hooks/use-local-storage';

import { QuickActionsModal } from './quick-actions-modal';
import { SIDEBAR_ITEMS, flattenSidebarItems } from './sidebar.utils';

type QuickActionsProps = {
  isCollapsed: boolean;
};

const useQuickActions = () => {
  const [stored, setStored] = useLocalStorage('quick-actions', '[]');

  const quickActionPaths: string[] = useMemo(() => JSON.parse(stored) as string[], [stored]);

  const setQuickActionPaths = useCallback((paths: string[]) => setStored(JSON.stringify(paths)), [setStored]);

  return [quickActionPaths, setQuickActionPaths] as const;
};

const QuickActions = ({ isCollapsed }: QuickActionsProps) => {
  const { t } = useTranslation();
  const { permissions } = usePermissions();
  const [quickActionPaths, setQuickActionPaths] = useQuickActions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleFlatItems = useMemo(() => {
    return flattenSidebarItems(SIDEBAR_ITEMS).filter((item) => !item.permission || permissions.includes(item.permission));
  }, [permissions]);

  const quickActionItems = useMemo(() => {
    return quickActionPaths.reduce<FlatSidebarItem[]>((acc, path) => {
      const item = visibleFlatItems.find((i) => i.to === path);
      if (item) acc.push(item);
      return acc;
    }, []);
  }, [quickActionPaths, visibleFlatItems]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (quickActionItems.length === 0 && isCollapsed) return null;

  return (
    <>
      <Box px={3} mb={3}>
        {!isCollapsed && (
          <Flex align="center" justify="space-between" px={3} mb={2} css={{ '& button': { opacity: 0, transition: 'opacity 0.15s ease' }, '&:hover button': { opacity: 1 } }}>
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" color="fg.subtle">
              {t('quickActions.title')}
            </Text>
            <IconButton aria-label={t('quickActions.edit')} variant="ghost" size="2xs" onClick={handleOpenModal}>
              <Pencil />
            </IconButton>
          </Flex>
        )}

        {isCollapsed && quickActionItems.length === 0 && (
          <Flex justify="center" mb={2}>
            <IconButton aria-label={t('quickActions.edit')} variant="ghost" size="2xs" onClick={handleOpenModal}>
              <Pencil />
            </IconButton>
          </Flex>
        )}

        {!isCollapsed && quickActionItems.length === 0 && (
          <Text fontSize="xs" fontStyle="italic" color="fg.subtle" px={3}>
            {t('quickActions.empty')}
          </Text>
        )}

        {quickActionItems.length > 0 && (
          <VStack gap={1} align="stretch">
            {quickActionItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Flex
                  align="center"
                  gap={2}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  color="fg.default"
                  _hover={{ bg: 'bg.muted' }}
                  transition="all 0.15s ease"
                  justify={isCollapsed ? 'center' : 'flex-start'}>
                  <Icon boxSize={4}>{item.icon}</Icon>
                  {!isCollapsed && (
                    <Text fontSize="sm" fontWeight="medium">
                      {t(item.labelKey)}
                    </Text>
                  )}
                </Flex>
              </Link>
            ))}
          </VStack>
        )}

        <Box borderBottomWidth="1px" mt={3} />
      </Box>

      <QuickActionsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        visibleItems={visibleFlatItems}
        selectedPaths={quickActionPaths}
        onSave={setQuickActionPaths}
      />
    </>
  );
};

export { QuickActions };

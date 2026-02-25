import type { FlatSidebarItem } from './sidebar.types';

import { useState } from 'react';

import { Button, Flex, Icon, Switch, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';

type QuickActionsModalProps = {
  open: boolean;
  onClose: () => void;
  visibleItems: FlatSidebarItem[];
  selectedPaths: string[];
  onSave: (paths: string[]) => void;
};

const QuickActionsModalContent = ({ onClose, visibleItems, selectedPaths, onSave }: Omit<QuickActionsModalProps, 'open'>) => {
  const { t } = useTranslation();
  const [localSelected, setLocalSelected] = useState<string[]>(selectedPaths);

  const handleToggle = (path: string, checked: boolean) => {
    setLocalSelected((prev) => (checked ? [...prev, path] : prev.filter((p) => p !== path)));
  };

  const handleSave = () => {
    onSave(localSelected);
    onClose();
  };

  return (
    <>
      <Modal.Body>
        <VStack gap={1} align="stretch">
          {visibleItems.map((item) => (
            <Flex key={item.to} align="center" justify="space-between" px={2} py={2} borderRadius="md" _hover={{ bg: 'bg.subtle' }}>
              <Flex align="center" gap={3}>
                <Icon boxSize={5} color="fg.muted">
                  {item.icon}
                </Icon>
                <Text fontSize="sm">{t(item.labelKey)}</Text>
              </Flex>
              <Switch.Root checked={localSelected.includes(item.to)} onCheckedChange={(e) => handleToggle(item.to, !!e.checked)} size="sm">
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Root>
            </Flex>
          ))}
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button colorPalette="brand" onClick={handleSave}>
          {t('common.save')}
        </Button>
      </Modal.Footer>
    </>
  );
};

const QuickActionsModal = ({ open, onClose, visibleItems, selectedPaths, onSave }: QuickActionsModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t('quickActions.modalTitle')} description={t('quickActions.modalDescription')} size="sm">
      {open && (
        <QuickActionsModalContent onClose={onClose} visibleItems={visibleItems} selectedPaths={selectedPaths} onSave={onSave} />
      )}
    </Modal>
  );
};

export { QuickActionsModal };

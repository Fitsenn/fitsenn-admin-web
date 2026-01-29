import { useState } from 'react';

import { Box, Button, Dialog, DialogCloseTrigger, Fieldset, Input, Portal, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { toaster } from '@/components/ui/toaster';

type DeleteAccountSectionProps = {
  onDelete: () => void;
  isPending: boolean;
};

const DeleteAccountSection = ({ onDelete, isPending }: DeleteAccountSectionProps) => {
  const { t } = useTranslation();
  const [confirmText, setConfirmText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    if (confirmText !== 'DELETE') {
      toaster.error({
        title: t('account.deleteConfirmationRequired'),
      });
      return;
    }

    // aici mai trebuie lucrat. trb sa vedem cum facem exact cu delete-ul - dar nu e final codul asta
    onDelete();
    setIsOpen(false);
  };

  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
    if (!details.open) {
      setConfirmText('');
    }
  };

  return (
    <Box bg={{ base: 'gray.50', _dark: 'gray.900' }} p={6} borderRadius="lg" borderWidth="1px" borderColor="red.200">
      <Fieldset.Root>
        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={2} color="red.600">
          {t('account.dangerZone')}
        </Fieldset.Legend>
        <Fieldset.Content>
          <Stack gap={4}>
            <Box>
              <Text fontWeight="medium">{t('account.deleteAccount')}</Text>
              <Text color="fg.muted" mt={1}>
                {t('account.deleteAccountDescription')}
              </Text>
            </Box>

            <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
              <Dialog.Trigger asChild>
                <Button colorPalette="red" variant="outline" alignSelf="flex-start">
                  {t('account.deleteAccountButton')}
                </Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>{t('account.deleteAccountConfirmTitle')}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Stack gap={4}>
                        <Text>{t('account.deleteAccountConfirmDescription')}</Text>
                        <Box>
                          <Text fontWeight="medium" mb={2}>
                            {t('account.typeToConfirm')}
                          </Text>
                          <Input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="DELETE"
                          />
                        </Box>
                      </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline">{t('account.cancel')}</Button>
                      </Dialog.ActionTrigger>
                      <Button
                        colorPalette="red"
                        onClick={handleDelete}
                        disabled={confirmText !== 'DELETE'}
                        loading={isPending}
                        loadingText={t('account.deleting')}>
                        {t('account.deleteAccountButton')}
                      </Button>
                    </Dialog.Footer>
                    <DialogCloseTrigger />
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>
    </Box>
  );
};

export { DeleteAccountSection };

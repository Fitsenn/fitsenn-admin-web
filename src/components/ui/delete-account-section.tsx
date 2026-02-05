import { useState } from 'react';

import { Box, Button, Fieldset, Input, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';
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

            <Button colorPalette="red" variant="outline" alignSelf="flex-start" onClick={() => setIsOpen(true)}>
              {t('account.deleteAccountButton')}
            </Button>

            <Modal
              open={isOpen}
              onClose={() => handleOpenChange({ open: false })}
              title={t('account.deleteAccountConfirmTitle')}>
              <Modal.Body>
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
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onClick={() => handleOpenChange({ open: false })}>
                  {t('account.cancel')}
                </Button>
                <Button
                  colorPalette="red"
                  onClick={handleDelete}
                  disabled={confirmText !== 'DELETE'}
                  loading={isPending}
                  loadingText={t('account.deleting')}>
                  {t('account.deleteAccountButton')}
                </Button>
              </Modal.Footer>
            </Modal>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>
    </Box>
  );
};

export { DeleteAccountSection };

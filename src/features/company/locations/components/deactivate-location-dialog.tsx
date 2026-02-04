import type { Location } from '../types';

import {
  Alert,
  Button,
  Dialog,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useCompany } from '@/hooks/use-company';
import { useLocationDependencies } from '../api/check-location-dependencies';
import { useToggleLocationStatus } from '../api/toggle-location-status';

type DeactivateLocationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
};

const DeactivateLocationDialog = ({ isOpen, onClose, location }: DeactivateLocationDialogProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: dependencies, isLoading: isCheckingDependencies } = useLocationDependencies(
    location?.id ?? '',
    isOpen && !!location,
  );

  const toggleMutation = useToggleLocationStatus(companyId);

  const handleConfirm = async () => {
    if (!location) return;

    await toggleMutation.mutateAsync({
      locationId: location.id,
      isActive: false,
    });

    onClose();
  };

  const hasWarnings = dependencies?.has_active_plans || dependencies?.has_active_memberships;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="450px">
          <Dialog.Header>
            <Dialog.Title>{t('locations.deactivate.title')}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4}>
              <Text>
                {t('locations.deactivate.confirm', { name: location?.name })}
              </Text>

              {isCheckingDependencies && (
                <Stack direction="row" align="center" gap={2}>
                  <Spinner size="sm" />
                  <Text fontSize="sm" color="fg.muted">
                    {t('locations.deactivate.checking')}
                  </Text>
                </Stack>
              )}

              {!isCheckingDependencies && hasWarnings && (
                <Alert.Root status="warning">
                  <Alert.Indicator />
                  <Stack gap={1}>
                    <Alert.Title>{t('locations.deactivate.warningTitle')}</Alert.Title>
                    <Alert.Description>
                      {dependencies?.has_active_plans && (
                        <Text fontSize="sm">
                          {t('locations.deactivate.activePlans', {
                            count: dependencies.active_plans_count,
                          })}
                        </Text>
                      )}
                      {dependencies?.has_active_memberships && (
                        <Text fontSize="sm">
                          {t('locations.deactivate.activeMemberships', {
                            count: dependencies.active_memberships_count,
                          })}
                        </Text>
                      )}
                    </Alert.Description>
                  </Stack>
                </Alert.Root>
              )}
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={onClose} disabled={toggleMutation.isPending}>
              {t('common.cancel')}
            </Button>
            <Button
              colorPalette="red"
              onClick={handleConfirm}
              loading={toggleMutation.isPending}
              disabled={isCheckingDependencies}
            >
              {t('locations.deactivate.confirm_button')}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export { DeactivateLocationDialog };

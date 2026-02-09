import type { Location } from '../types';

import {
  Alert,
  Button,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';
import { useCompany } from '@/contexts';
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

  const hasWarnings = dependencies?.hasActivePlans || dependencies?.hasActiveMemberships;

  return (
    <Modal open={isOpen} onClose={onClose} title={t('locations.deactivate.title')}>
      <Modal.Body>
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
                  {dependencies?.hasActivePlans && (
                    <Text fontSize="sm">
                      {t('locations.deactivate.activePlans', {
                        count: dependencies.activePlansCount,
                      })}
                    </Text>
                  )}
                  {dependencies?.hasActiveMemberships && (
                    <Text fontSize="sm">
                      {t('locations.deactivate.activeMemberships', {
                        count: dependencies.activeMembershipsCount,
                      })}
                    </Text>
                  )}
                </Alert.Description>
              </Stack>
            </Alert.Root>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
};

export { DeactivateLocationDialog };

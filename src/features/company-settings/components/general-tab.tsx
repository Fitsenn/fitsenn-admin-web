import { Alert, Spinner, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useCompany } from '@/hooks/use-company';
import { useCompanySettings } from '../api/get-company-settings';
import { GeneralForm } from './general-form';

const GeneralTab = () => {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: settings, isLoading, isError } = useCompanySettings(companyId);

  if (isLoading) {
    return (
      <Stack align="center" py={10}>
        <Spinner />
      </Stack>
    );
  }

  if (isError || !settings) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{t('common.error')}</Alert.Title>
      </Alert.Root>
    );
  }

  return <GeneralForm companyId={companyId} settings={settings} />;
};

export { GeneralTab };

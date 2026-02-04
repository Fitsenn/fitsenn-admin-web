import type { GeneralFormData } from './general-form.schema';

import { useRef, useState } from 'react';

import { Alert, Box, Button, Fieldset, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { toaster } from '@/components/ui/toaster';
import { useCompany } from '@/hooks/use-company';
import { useCompanySettings } from '../api/get-company-settings';
import { useUpdateCompanySettings } from '../api/update-company-settings';
import { useUploadCompanyLogo } from '../api/upload-company-logo';
import { generalFormSchema } from './general-form.schema';
import { LogoUpload } from './logo-upload';

const CompanySettingsPage = () => {
  const [hasLogoChange, setHasLogoChange] = useState(false);
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const [logoResetKey, setLogoResetKey] = useState(0);
  const selectedFileRef = useRef<File | null>(null);

  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';
  const updateMutation = useUpdateCompanySettings(companyId);
  const uploadLogoMutation = useUploadCompanyLogo();

  const { data: settings, isPending, isError } = useCompanySettings(companyId);

  const methods = useForm<GeneralFormData>({
    resolver: zodResolver(generalFormSchema),
    values: {
      name: settings?.name ?? '',
      code: settings?.code ?? '',
    },
  });

  const {
    control,
    setError,
    formState: { isDirty },
  } = methods;

  const isMutationPending = updateMutation.isPending || uploadLogoMutation.isPending;
  const hasChanges = isDirty || hasLogoChange;

  const handleSubmit = async (data: GeneralFormData) => {
    try {
      let logoUrl = settings?.logo_url;

      if (selectedFileRef.current) {
        logoUrl = await uploadLogoMutation.mutateAsync({
          companyId,
          file: selectedFileRef.current,
        });
      } else if (isRemovingLogo) {
        logoUrl = null;
      }

      await updateMutation.mutateAsync({
        companyId,
        name: data.name,
        code: data.code,
        logoUrl,
      });

      selectedFileRef.current = null;
      setHasLogoChange(false);
      setIsRemovingLogo(false);
      setLogoResetKey((prev) => prev + 1);

      toaster.success({ title: t('companySettings.general.updateSuccess') });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('Company code already exists')) {
        setError('code', { message: t('companySettings.general.codeUnavailable') });
      } else {
        toaster.error({ title: t('companySettings.general.updateError') });
      }
    }
  };

  const handleFileSelected = (file: File | null) => {
    selectedFileRef.current = file;
    setHasLogoChange(file !== null || settings?.logo_url !== null);
    setIsRemovingLogo(file === null && settings?.logo_url !== null);
  };

  if (isPending) {
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

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('companySettings.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('companySettings.description')}
        </Text>
      </Box>

      <Box bg={{ base: 'gray.50', _dark: 'gray.900' }} p={6} borderRadius="lg">
        <Fieldset.Root>
          <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={2}>
            {t('companySettings.general.companyInfo')}
          </Fieldset.Legend>
          <Text color="fg.muted" mb={4}>
            {t('companySettings.general.companyInfoDescription')}
          </Text>
          <Fieldset.Content>
            <FormRHF methods={methods} onSubmit={handleSubmit}>
              <Stack gap={4}>
                <InputRHF control={control} name="name" label={t('companySettings.general.name')} required />
                <InputRHF
                  control={control}
                  name="code"
                  label={t('companySettings.general.code')}
                  helperText={t('companySettings.general.codeHelperText')}
                  required
                />

                <LogoUpload key={logoResetKey} currentLogoUrl={settings.logo_url} onFileSelected={handleFileSelected} />

                <Button
                  type="submit"
                  colorPalette="brand"
                  alignSelf="flex-start"
                  disabled={!hasChanges}
                  loading={isMutationPending}
                  loadingText={t('companySettings.general.saving')}>
                  {t('companySettings.general.saveChanges')}
                </Button>
              </Stack>
            </FormRHF>
          </Fieldset.Content>
        </Fieldset.Root>
      </Box>
    </Stack>
  );
};

export { CompanySettingsPage };

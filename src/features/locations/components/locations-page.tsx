import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { LocationsTable } from './locations-table';

const LocationsPage = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('locations.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('locations.description')}
        </Text>
      </Box>

      <LocationsTable />
    </Stack>
  );
};

export { LocationsPage };

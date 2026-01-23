import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type TableEmptyProps = {
  message?: string;
};

const TableEmpty = ({ message }: TableEmptyProps) => {
  const { t } = useTranslation();

  return (
    <Box py={12} px={6} textAlign="center" bg="bg.panel">
      <VStack gap={2}>
        <Heading size="md" color="fg.muted">
          {message ?? t('table.noData')}
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          {t('table.noDataHint')}
        </Text>
      </VStack>
    </Box>
  );
};

export { TableEmpty };

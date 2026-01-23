import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type TableErrorProps = {
  error: Error;
  onRetry?: () => void;
};

const TableError = ({ error, onRetry }: TableErrorProps) => {
  const { t } = useTranslation();

  return (
    <Box py={12} px={6} textAlign="center" bg="bg.panel">
      <VStack gap={2}>
        <Heading size="md" color="fg.error">
          {t('table.somethingWentWrong')}
        </Heading>
        <Text fontSize="sm" color="fg.muted">
          {error.message || t('table.unexpectedError')}
        </Text>
      </VStack>
      {onRetry && (
        <Button size="sm" variant="outline" mt={4} onClick={onRetry}>
          {t('common.tryAgain')}
        </Button>
      )}
    </Box>
  );
};

export { TableError };

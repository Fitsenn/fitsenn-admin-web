import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

type TableErrorProps = {
  error: Error;
  onRetry?: () => void;
};

const TableError = ({ error, onRetry }: TableErrorProps) => {
  return (
    <Box py={12} px={6} textAlign="center" bg="bg.panel">
      <VStack gap={2}>
        <Heading size="md" color="fg.error">
          Something went wrong
        </Heading>
        <Text fontSize="sm" color="fg.muted">
          {error.message || 'An unexpected error occurred'}
        </Text>
      </VStack>
      {onRetry && (
        <Button size="sm" variant="outline" mt={4} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
};

export { TableError };

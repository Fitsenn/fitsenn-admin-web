import { Box, Heading, Text, VStack } from '@chakra-ui/react';

type TableEmptyProps = {
  message?: string;
};

const TableEmpty = ({ message = 'No data available' }: TableEmptyProps) => {
  return (
    <Box py={12} px={6} textAlign="center" bg="bg.panel">
      <VStack gap={2}>
        <Heading size="md" color="fg.muted">
          {message}
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          Try adjusting your filters or check back later.
        </Text>
      </VStack>
    </Box>
  );
};

export { TableEmpty };

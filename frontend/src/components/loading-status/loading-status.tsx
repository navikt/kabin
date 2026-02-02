import { Box, HStack, Skeleton, VStack } from '@navikt/ds-react';

export const LoadingStatus = () => (
  <VStack gap="space-16" width="1000px" padding="space-16">
    <Box padding="space-16" shadow="dialog">
      <Skeleton height={80} />
      <Skeleton height={30} width={600} />
      <Skeleton height={40} width={250} />
      <HStack gap="space-8" wrap={false}>
        <Skeleton height={40} width={200} />
        <Skeleton height={40} width={160} />
        <Skeleton height={40} width={220} />
        <Skeleton height={40} width={140} />
      </HStack>
    </Box>

    <div className="grid grid-cols-2 grid-rows-[auto] gap-4">
      <VStack gap="space-12" asChild>
        <Box padding="space-16" shadow="dialog">
          <Skeleton height={40} width={250} />

          <KeyValue />

          <KeyValue />
          <KeyValue />

          <HStack gap="space-8" wrap={false}>
            <KeyValue min={80} max={150} />
            <KeyValue min={80} max={150} />
          </HStack>

          <KeyValue />
          <KeyValue />
          <KeyValue />
          <KeyValue />
        </Box>
      </VStack>

      <VStack gap="space-12" asChild>
        <Box padding="space-16" shadow="dialog">
          <Skeleton height={40} width={300} />
          <KeyValue />
          <KeyValue />
          <KeyValue />
          <KeyValue />
          <KeyValue />
          <KeyValue />
        </Box>
      </VStack>

      <VStack gap="space-12" asChild>
        <Box padding="space-16" shadow="dialog">
          <Skeleton height={40} width={300} />
          <KeyValue />
          <KeyValue />
          <Skeleton height={150} />
        </Box>
      </VStack>

      <VStack gap="space-12" asChild>
        <Box padding="space-16" shadow="dialog">
          <Skeleton height={40} width={300} />
          <KeyValue />
          <KeyValue />
          <KeyValue />
          <HStack gap="space-8" wrap={false}>
            <KeyValue min={80} max={150} />
            <KeyValue min={80} max={150} />
          </HStack>
        </Box>
      </VStack>
    </div>
  </VStack>
);

const KeyValue = ({ min = 100, max = 300 }: { min?: number; max?: number }) => {
  const key = Math.floor(Math.random() * max) + min;
  const value = Math.floor(Math.random() * max) + min;

  return (
    <div>
      <Skeleton height={24} width={key} />
      <Skeleton height={24} width={value} />
    </div>
  );
};

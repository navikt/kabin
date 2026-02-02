import { Box, HStack, Loader, VStack } from '@navikt/ds-react';

interface Props {
  text: string;
}

export const AppLoader = ({ text }: Props) => (
  <Box asChild background="default">
    <HStack align="center" justify="center" width="100vw" height="100vh" wrap={false}>
      <VStack align="center">
        <Loader size="2xlarge" variant="neutral" transparent title={text} />
        <span>{text}</span>
      </VStack>
    </HStack>
  </Box>
);

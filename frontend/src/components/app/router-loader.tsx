import { HStack, Loader } from '@navikt/ds-react';

export const RouterLoader = () => (
  <HStack align="center" justify="center" height="100vh" width="100vw" className="bg-ax-bg-default" wrap={false}>
    <Loader size="2xlarge" variant="interaction" transparent title="Laster siden..." />
  </HStack>
);

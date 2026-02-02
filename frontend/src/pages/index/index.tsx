import { Finished } from '@app/pages/index/finished/finished';
import { NewRegistrering } from '@app/pages/status/new-registrering';
import { HStack, VStack } from '@navikt/ds-react';

export const IndexPage = () => (
  <VStack as="main" align="start" gap="space-32" overflow="auto" padding="space-16">
    <HStack align="center" justify="center" width="100%" padding="space-40">
      <NewRegistrering orientation="vertical" />
    </HStack>
    <Finished />
  </VStack>
);

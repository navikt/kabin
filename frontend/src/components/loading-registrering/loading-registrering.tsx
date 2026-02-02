import { Card, CardFullHeight, CardMedium, CardSmall } from '@app/components/card/card';
import { LoadingDocuments } from '@app/components/documents/loading-documents';
import { LoadingGosysOppgaver } from '@app/components/gosys-oppgaver/loading-gosys-oppgaver';
import { LoadingKlagemuligheter } from '@app/components/muligheter/klage/loading-klagemuligheter';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { LeftColumn, RightColumn, StyledMain } from '@app/pages/registrering/layout';
import { FileTextIcon } from '@navikt/aksel-icons';
import { Box, HStack, Skeleton, VStack } from '@navikt/ds-react';

export const LoadingOverstyringer = () => (
  <Card>
    <HStack align="center" gap="space-16" wrap={false}>
      <Skeleton height={40} width={150} />
      <Skeleton height={40} width={70} />
      <Skeleton height={40} width={200} />
      <Skeleton height={24} width={100} />
    </HStack>

    <div className="grid grid-cols-2 gap-4">
      <Skeleton height={40} width={300} />
      <Skeleton height={40} />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <Part />
      <Part />
      <Part />
    </div>
  </Card>
);

export const LoadingSvarbrev = () => (
  <HStack gap="space-2" className="self-center" wrap={false}>
    <Skeleton height={40} width={125} />
    <Skeleton height={40} width={125} />
  </HStack>
);

export const LoadingRegistrering = () => (
  <StyledMain>
    <HStack align="center" paddingBlock="space-8 space-0" paddingInline="space-16 space-0" wrap={false}>
      <Skeleton height={40} width={300} />
    </HStack>
    <LeftColumn>
      <CardMedium>
        <LoadingDocuments />
      </CardMedium>

      <HStack gap="space-2" className="self-center" wrap={false}>
        <Skeleton height={40} width={75} />
        <Skeleton height={40} width={75} />
      </HStack>

      <CardSmall>
        <LoadingKlagemuligheter />
      </CardSmall>

      <LoadingGosysOppgaver />

      <LoadingOverstyringer />

      <LoadingSvarbrev />
    </LeftColumn>
    <RightColumn>
      <CardFullHeight>
        <Placeholder>
          <FileTextIcon aria-hidden />
        </Placeholder>
      </CardFullHeight>
    </RightColumn>
  </StyledMain>
);

const Part = () => (
  <Box
    asChild
    borderRadius="4"
    borderColor="neutral-subtle"
    borderWidth="1"
    paddingBlock="space-16 space-0"
    paddingInline="space-32 space-0"
  >
    <VStack gap="space-16" height="166px">
      <Skeleton height={24} width={100} />
      <Skeleton height={24} width={200} />
      <Skeleton height={24} width={70} />
    </VStack>
  </Box>
);

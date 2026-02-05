import { ExternalLinkButton } from '@app/components/link-button/link-button';
import { SeUtfylling } from '@app/components/se-utfylling-button/se-utfylling-button';
import { KABAL_URL } from '@app/constants';
import { NewRegistrering } from '@app/pages/status/new-registrering';
import { HouseIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router-dom';

interface StatusHeadingProps {
  headingText: string;
  alertText: string;
  behandlingId: string;
  registreringId: string;
}

export const StatusHeading = ({ headingText, alertText, behandlingId, registreringId }: StatusHeadingProps) => (
  <Box
    background="default"
    padding="space-12"
    borderRadius="4"
    shadow="dialog"
    className="sticky -top-27.5 z-1 mx-auto mb-6 w-250"
  >
    <VStack gap="space-8">
      <Alert variant="success">
        <Heading level="1" size="medium">
          {headingText}
        </Heading>
      </Alert>

      <Alert variant="info" inline>
        {alertText}
      </Alert>

      <NewRegistrering orientation="horizontal" />
      <HStack align="center" justify="start" gap="space-8" width="100%">
        <Button
          data-color="neutral"
          as={RouterLink}
          to="/"
          variant="secondary"
          size="small"
          icon={<HouseIcon aria-hidden role="presentation" />}
        >
          Tilbake til forsiden
        </Button>

        <ExternalLinkButton href={`${KABAL_URL}/sok`} variant="secondary-neutral" size="small">
          Åpne Kabal søk
        </ExternalLinkButton>

        <ExternalLinkButton href={`${KABAL_URL}/behandling/${behandlingId}`} variant="secondary-neutral" size="small">
          Åpne behandling i Kabal
        </ExternalLinkButton>

        <SeUtfylling registreringId={registreringId} />
      </HStack>
    </VStack>
  </Box>
);

import { ExternalLinkButton } from '@app/components/link-button/link-button';
import { SeUtfylling } from '@app/components/se-utfylling-button/se-utfylling-button';
import { KABAL_URL } from '@app/constants';
import { NewRegistrering } from '@app/pages/status/new-registrering';
import { CheckmarkCircleFillIcon, HouseIcon } from '@navikt/aksel-icons';
import { Box, Button, Heading, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router';

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
    className="sticky -top-27.5 z-20 mb-6 w-full"
  >
    <VStack gap="space-8">
      <Box
        asChild
        background="success-soft"
        borderColor="success"
        borderWidth="1"
        borderRadius="8"
        paddingBlock="space-12"
        paddingInline="space-16"
        className="flex items-center gap-x-2"
      >
        <Heading level="1" size="medium">
          <CheckmarkCircleFillIcon />
          {headingText}
        </Heading>
      </Box>

      <InlineMessage status="info">{alertText}</InlineMessage>

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

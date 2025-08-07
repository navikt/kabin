import { ExternalLinkButton } from '@app/components/link-button/link-button';
import { SeUtfylling } from '@app/components/se-utfylling-button/se-utfylling-button';
import { KABAL_URL } from '@app/constants';
import { NewRegistrering } from '@app/pages/status/new-registrering';
import { type RegistreringType, SaksTypeEnum } from '@app/types/common';
import { HouseIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from 'styled-components';

interface StatusHeadingProps {
  headingText: string;
  alertText: string;
  type: RegistreringType;
  behandlingId: string;
  registreringId: string;
}

export const StatusHeading = ({ headingText, alertText, type, behandlingId, registreringId }: StatusHeadingProps) => (
  <Container>
    <Alert variant="success">
      <Heading level="1" size="medium">
        {headingText}
      </Heading>
    </Alert>

    <Alert variant="info" inline>
      {alertText}
    </Alert>

    <NewRegistrering orientation="horizontal" />
    <Buttons>
      <Button
        as={RouterLink}
        to="/"
        variant="secondary-neutral"
        size="small"
        icon={<HouseIcon aria-hidden role="presentation" />}
      >
        Tilbake til forsiden
      </Button>

      <ExternalLinkButton href={`${KABAL_URL}/sok`} variant="secondary-neutral" size="small">
        Åpne Kabal søk
      </ExternalLinkButton>

      <ExternalLinkButton href={getKabalUrl(type, behandlingId)} variant="secondary-neutral" size="small">
        Åpne behandling i Kabal
      </ExternalLinkButton>

      <SeUtfylling registreringId={registreringId} />
    </Buttons>
  </Container>
);

const getKabalUrl = (type: RegistreringType, behandlingId: string) => {
  switch (type) {
    case SaksTypeEnum.KLAGE:
      return `${KABAL_URL}/klagebehandling/${behandlingId}`;
    case SaksTypeEnum.ANKE:
      return `${KABAL_URL}/ankebehandling/${behandlingId}`;
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return `${KABAL_URL}/omgjøringskravbehandling/${behandlingId}`;
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 1000px;
  margin: 0 auto;
  padding: 12px;
  margin-bottom: 24px;
  background-color: var(--ax-bg-default);
  position: sticky;
  top: -110px;
  z-index: 1;
  box-shadow: var(--ax-shadow-dialog);
  border-radius: var(--ax-radius-4);
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  column-gap: 8px;
  width: 100%;
`;

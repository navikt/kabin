import { HouseIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from 'styled-components';
import { ExternalLinkButton } from '@app/components/link-button/link-button';
import { SeUtfylling } from '@app/components/se-utfylling-button/se-utfylling-button';
import { KABAL_URL } from '@app/constants';
import { NewRegistrering } from '@app/pages/status/new-registrering';
import { SaksTypeEnum } from '@app/types/common';

interface StatusHeadingProps {
  headingText: string;
  alertText: string;
  type: SaksTypeEnum;
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
        variant="secondary"
        size="small"
        icon={<HouseIcon aria-hidden role="presentation" />}
      >
        Tilbake til forsiden
      </Button>

      <ExternalLinkButton href={`${KABAL_URL}/sok`} variant="secondary" size="small">
        Åpne Kabal søk
      </ExternalLinkButton>

      <ExternalLinkButton
        href={`${KABAL_URL}/${type === SaksTypeEnum.ANKE ? 'ankebehandling' : 'klagebehandling'}/${behandlingId}`}
        variant="secondary"
        size="small"
      >
        Åpne behandling i Kabal
      </ExternalLinkButton>

      <SeUtfylling registreringId={registreringId} />
    </Buttons>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 1000px;
  margin: 0 auto;
  padding: 12px;
  margin-bottom: 24px;
  background-color: var(--a-bg-default);
  position: sticky;
  top: -110px;
  z-index: 1;
  box-shadow: var(--a-shadow-small);
  border-radius: var(--a-border-radius-medium);
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  column-gap: 8px;
  width: 100%;
`;

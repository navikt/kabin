import { CheckmarkIcon, ExternalLinkIcon, HouseIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Label } from '@navikt/ds-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { CopyPartIdButton, StyledCopyButton } from '@app/components/copy-button/copy-part-id';
import { ENVIRONMENT } from '@app/environment';
import { useFagsystemName } from '@app/hooks/kodeverk';
import { StyledPart } from '@app/pages/status/styled-components';
import { ISak } from '@app/types/dokument';

interface InfoProps {
  label: string;
  children: React.ReactNode;
}

const KABAL_URL = ENVIRONMENT.isProduction ? 'https://kabal.intern.nav.no' : 'https://kabal.intern.dev.nav.no';

export const InfoItem = ({ label, children }: InfoProps) => (
  <StyledInfo>
    <Label>{label}</Label>
    {typeof children === 'string' ? <BodyShort>{children}</BodyShort> : children}
  </StyledInfo>
);

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Time = ({ dateTime, children }: TimeProps) => (
  <BodyShort>
    <time dateTime={dateTime}>{children}</time>
  </BodyShort>
);

interface TimeProps {
  dateTime: string;
  children: string;
}

interface SakProps {
  sak: Omit<ISak, 'datoOpprettet' | 'fagsaksystem'> | null;
}

export const Sak = ({ sak }: SakProps) => {
  const fagsystemName = useFagsystemName(sak?.fagsystemId);

  return (
    <StyledSak>
      <InfoItem label="Fagsystem">{sak === null ? 'Ingen' : fagsystemName}</InfoItem>
      <InfoItem label="Saks-ID">
        {sak === null ? (
          'Ingen'
        ) : (
          <StyledCopyButton
            copyText={sak.fagsakId}
            size="small"
            activeIcon={<CheckmarkIcon aria-hidden />}
            text={sak.fagsakId}
          />
        )}
      </InfoItem>
    </StyledSak>
  );
};

const StyledSak = styled.div`
  display: flex;
  gap: 16px;
`;

interface PartProps {
  title: string;
  part: { id: string; name?: string | null } | null;
}

export const Part = ({ part, title }: PartProps) => {
  if (part === null) {
    return (
      <InfoItem label={title}>
        <BodyShort>Ingen</BodyShort>
      </InfoItem>
    );
  }

  return (
    <InfoItem label={title}>
      <StyledPart>
        <span>{part.name ?? 'Navn mangler'}</span>
        <CopyPartIdButton id={part.id} />
      </StyledPart>
    </InfoItem>
  );
};

interface StatusHeadingProps {
  headingText: string;
  alertText: string;
}

export const StatusHeading = ({ headingText, alertText }: StatusHeadingProps) => (
  <>
    <StyledAlert variant="success" $gridArea="title">
      <Heading level="1" size="medium">
        {headingText}
      </Heading>
    </StyledAlert>

    <InfoPanel>
      <Alert variant="info" inline>
        {alertText}
      </Alert>
      <Buttons>
        <Button as={NavLink} to="/" variant="tertiary" icon={<HouseIcon aria-hidden />}>
          Tilbake til forsiden
        </Button>
        <Button
          as={NavLink}
          to={`${KABAL_URL}/sok`}
          variant="tertiary"
          target="_blank"
          icon={<ExternalLinkIcon title="Ekstern lenke" />}
        >
          Åpne Kabal
        </Button>
      </Buttons>
    </InfoPanel>
  </>
);

const StyledAlert = styled(Alert)<{ $gridArea: string }>`
  grid-area: ${({ $gridArea }) => $gridArea};
`;

const InfoPanel = styled.div`
  display: flex;
  grid-area: info;
  align-items: center;
  column-gap: 8px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

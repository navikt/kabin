import { ExternalLinkIcon, HouseIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Label } from '@navikt/ds-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';
import { CopyPartIdButton, StyledCopyButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { ENVIRONMENT } from '@app/environment';
import { useFagsystemName } from '@app/hooks/kodeverk';
import { StyledPart } from '@app/pages/status/styled-components';
import { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
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
        {sak === null ? 'Ingen' : <StyledCopyButton copyText={sak.fagsakId} text={sak.fagsakId} size="xsmall" />}
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
  part: IPart | null;
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
        <CopyPartIdButton id={part.id} size="xsmall" />
      </StyledPart>
      <PartStatusList statusList={part.statusList} />
    </InfoItem>
  );
};

interface NavEmployeeProps {
  title: string;
  employee: ISaksbehandler | null;
}

export const NavEmployee = ({ title, employee }: NavEmployeeProps) => (
  <InfoItem label={title}>
    {employee === null ? (
      <BodyShort>Ingen</BodyShort>
    ) : (
      <StyledPart>
        <span>
          {employee.navn} ({employee.navIdent})
        </span>
        <CopyPartIdButton id={employee.navIdent} size="xsmall" />
      </StyledPart>
    )}
  </InfoItem>
);

interface StatusHeadingProps {
  headingText: string;
  alertText: string;
  type: SaksTypeEnum;
  behandlingId: string | undefined;
}

export const StatusHeading = ({ headingText, alertText, type, behandlingId }: StatusHeadingProps) => (
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
        <Button as={NavLink} to="/" variant="primary" size="small" icon={<HouseIcon aria-hidden />}>
          Tilbake til forsiden
        </Button>
        <Button
          as={NavLink}
          to={`${KABAL_URL}/sok`}
          variant="secondary"
          size="small"
          target="_blank"
          icon={<ExternalLinkIcon title="Ekstern lenke" />}
        >
          Åpne Kabal søk
        </Button>
        {behandlingId === undefined ? null : (
          <Button
            as={NavLink}
            to={`${KABAL_URL}/${type === SaksTypeEnum.ANKE ? 'ankebehandling' : 'klagebehandling'}/${behandlingId}`}
            variant="secondary"
            size="small"
            target="_blank"
            icon={<ExternalLinkIcon title="Ekstern lenke" />}
          >
            Åpne behandling i Kabal
          </Button>
        )}
      </Buttons>
    </InfoPanel>
  </>
);

const StyledAlert = styled(Alert)<{ $gridArea: string }>`
  grid-area: ${({ $gridArea }) => $gridArea};
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: info;
  align-items: flex-start;
  column-gap: 8px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding-top: 16px;
`;

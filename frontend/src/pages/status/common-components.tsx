import { HouseIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Label } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from 'styled-components';
import { CopyPartIdButton, StyledCopyButton } from '@app/components/copy-button/copy-part-id';
import { ExternalLinkButton } from '@app/components/link-button/link-button';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { KABAL_URL } from '@app/constants';
import { useFagsystemName } from '@app/hooks/kodeverk';
import { NewRegistrering } from '@app/pages/status/new-registrering';
import { StyledPart } from '@app/pages/status/styled-components';
import { IPart, ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import { ISak } from '@app/types/dokument';

interface InfoProps {
  label: string;
  children: React.ReactNode;
}

export const InfoItem = ({ label, children }: InfoProps) => (
  <StyledInfo>
    <StyledLabel>
      {label}

      {typeof children === 'string' ? <BodyShort>{children}</BodyShort> : children}
    </StyledLabel>
  </StyledInfo>
);

const StyledLabel = styled(Label)`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
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
  behandlingId: string | null;
}

export const StatusHeading = ({ headingText, alertText, type, behandlingId }: StatusHeadingProps) => (
  <Container>
    <Alert variant="success">
      <Heading level="1" size="medium">
        {headingText}
      </Heading>
    </Alert>

    <Alert variant="info" inline>
      {alertText}
    </Alert>

    <Inputs>
      <NewRegistrering />
      <Button as={RouterLink} to="/" variant="secondary" size="small" icon={<HouseIcon aria-hidden />}>
        Tilbake til forsiden
      </Button>
      <ExternalLinkButton href={`${KABAL_URL}/sok`} variant="secondary" size="small">
        Åpne Kabal søk
      </ExternalLinkButton>
      {behandlingId === null ? null : (
        <ExternalLinkButton
          href={`${KABAL_URL}/${type === SaksTypeEnum.ANKE ? 'ankebehandling' : 'klagebehandling'}/${behandlingId}`}
          variant="secondary"
          size="small"
        >
          Åpne behandling i Kabal
        </ExternalLinkButton>
      )}
    </Inputs>
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

const Inputs = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  column-gap: 8px;
  width: 100%;
`;

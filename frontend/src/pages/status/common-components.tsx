import { CopyPartIdButton, StyledCopyButton } from '@app/components/copy-button/copy-part-id';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { useFagsystemName } from '@app/hooks/kodeverk';
import { StyledPart } from '@app/pages/status/styled-components';
import type { IPart, ISaksbehandler } from '@app/types/common';
import type { ISak } from '@app/types/dokument';
import { BodyShort, Label } from '@navikt/ds-react';
import { styled } from 'styled-components';

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

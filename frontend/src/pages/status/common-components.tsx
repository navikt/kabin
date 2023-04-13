import { BodyShort, Label, Tag } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useFagsystemName } from '@app/hooks/kodeverk';
import { ISak } from '@app/types/dokument';

interface InfoProps {
  label: string;
  children: React.ReactNode;
}

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

const Code = ({ children }: { children: React.ReactNode }) => <StyledCode variant="neutral">{children}</StyledCode>;

interface TimeProps {
  dateTime: string;
  children: string;
}

const StyledCode = styled(Tag)`
  font-family: monospace;
  width: fit-content;
  font-size: 16px;
`;

interface SakProps {
  sak: Omit<ISak, 'datoOpprettet' | 'fagsaksystem'> | null;
}

export const Sak = ({ sak }: SakProps) => {
  const fagsystemName = useFagsystemName(sak?.fagsystemId);

  if (sak === null) {
    return null;
  }

  return (
    <StyledSak>
      <InfoItem label="Fagsystem">{fagsystemName}</InfoItem>
      <InfoItem label="Saks-ID">
        <Code>{sak.fagsakId}</Code>
      </InfoItem>
    </StyledSak>
  );
};

const StyledSak = styled.div`
  display: flex;
  gap: 16px;
`;

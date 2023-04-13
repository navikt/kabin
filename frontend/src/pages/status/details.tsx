import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { Card } from '@app/components/card/card';
import { CopyIdButton } from '@app/components/overstyringer/part-read';
import { isoDateTimeToPrettyDate, isoDateToPretty } from '@app/domain/date';
import { getSakspartName } from '@app/domain/name';
import { useUtfallName, useYtelseName } from '@app/hooks/kodeverk';
import { IPart } from '@app/types/common';
import { IStatus } from '@app/types/status';
import { InfoItem, Sak, Time } from './common-components';
import { Journalpost } from './journalpost';

export const Details = ({
  frist,
  mottattNav,
  vedtakDate,
  utfallId,
  ytelseId,
  fullmektig,
  journalpost,
  klager,
  fagsakId,
  fagsystemId,
  sakenGjelder,
}: IStatus) => {
  const ytelse = useYtelseName(ytelseId);
  const utfall = useUtfallName(utfallId);

  return (
    <>
      <StyledCard title="Journalført anke" $gridArea="journalpost" titleSize="medium">
        <Journalpost journalpost={journalpost} />
      </StyledCard>

      <StyledCard title="Valgt klage" $gridArea="klage" titleSize="medium">
        <InfoItem label="Saken gjelder">
          <Part part={sakenGjelder} />
        </InfoItem>

        <InfoItem label="Vedtaksdato">{isoDateTimeToPrettyDate(vedtakDate) ?? vedtakDate}</InfoItem>

        <InfoItem label="Ytelse">{ytelse}</InfoItem>
        <InfoItem label="Utfall">{utfall}</InfoItem>

        <Sak sak={{ fagsystemId, fagsakId }} />
      </StyledCard>

      <StyledCard title="Saksinfo" $gridArea="anke" titleSize="medium">
        <InfoItem label="Mottatt NAV Klageinstans">
          <Time dateTime={mottattNav}>{isoDateToPretty(mottattNav) ?? mottattNav}</Time>
        </InfoItem>
        <InfoItem label="Frist">
          <Time dateTime={frist}>{isoDateToPretty(frist) ?? frist}</Time>
        </InfoItem>
        <InfoItem label="Klager">
          <Part part={klager} />
        </InfoItem>
        <InfoItem label="Fullmektig">
          <Part part={fullmektig} />
        </InfoItem>
      </StyledCard>
    </>
  );
};

const StyledCard = styled(Card)<{ $gridArea: string }>`
  grid-area: ${({ $gridArea }) => $gridArea};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Part = ({ part }: PartProps) => {
  if (part === null) {
    return <BodyShort>-</BodyShort>;
  }

  return (
    <StyledPart>
      <span>{getSakspartName(part) ?? 'Ukjent'}</span>
      <CopyIdButton part={part} />
    </StyledPart>
  );
};

interface PartProps {
  part: IPart | null;
}

const StyledPart = styled(BodyShort)`
  display: flex;
  gap: 8px;
  align-items: center;
`;

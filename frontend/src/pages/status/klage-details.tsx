import React from 'react';
import { IKlagestatus } from '@app/types/status';
import { Part } from './common-components';
import { DateInfoItem } from './date';
import { Journalpost } from './journalpost';
import { Mulighet } from './mulighet';
import { StyledCard } from './styled-components';

export const KlageDetails = ({
  frist,
  mottattVedtaksinstans,
  mottattKlageinstans,
  vedtakDate,
  utfallId,
  ytelseId,
  fullmektig,
  journalpost,
  klager,
  fagsakId,
  fagsystemId,
  sakenGjelder,
}: IKlagestatus) => (
  <>
    <Journalpost title="Valgt journalpost" journalpost={journalpost} />

    <StyledCard title="Saksinfo" $gridArea="case" titleSize="medium">
      <DateInfoItem title="Mottatt vedtaksinstans" date={mottattVedtaksinstans} />
      <DateInfoItem title="Mottatt Klageinstans" date={mottattKlageinstans} />
      <DateInfoItem title="Frist" date={frist} />
      <Part title="Klager" part={klager} />
      <Part title="Fullmektig" part={fullmektig} />
    </StyledCard>

    <Mulighet
      title="Valgt vedtak"
      fagsakId={fagsakId}
      fagsystemId={fagsystemId}
      sakenGjelder={sakenGjelder}
      utfallId={utfallId}
      vedtakDate={vedtakDate}
      ytelseId={ytelseId}
    />
  </>
);

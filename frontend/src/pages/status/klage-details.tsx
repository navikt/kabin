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
  ytelseId,
  fullmektig,
  journalpost,
  klager,
  fagsakId,
  fagsystemId,
  sakenGjelder,
  tildeltSaksbehandler,
}: IKlagestatus) => (
  <>
    <Journalpost title="Valgt journalpost" journalpost={journalpost} />

    <StyledCard title="Saksinfo" $gridArea="case" titleSize="medium">
      <DateInfoItem title="Mottatt vedtaksinstans" date={mottattVedtaksinstans} />
      <DateInfoItem title="Mottatt Klageinstans" date={mottattKlageinstans} />
      <DateInfoItem title="Frist" date={frist} />
      <Part title="Klager" part={klager} />
      <Part title="Fullmektig" part={fullmektig} />
      <Part
        title="Tildelt saksbehandler"
        part={
          tildeltSaksbehandler === null ? null : { id: tildeltSaksbehandler.navIdent, name: tildeltSaksbehandler.navn }
        }
      />
    </StyledCard>

    <Mulighet
      title="Valgt vedtak"
      fagsakId={fagsakId}
      fagsystemId={fagsystemId}
      sakenGjelder={sakenGjelder}
      vedtakDate={vedtakDate}
      ytelseId={ytelseId}
    />
  </>
);

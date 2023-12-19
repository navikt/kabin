import React from 'react';
import { IAnkestatus } from '@app/types/status';
import { Part } from './common-components';
import { DateInfoItem } from './date';
import { Journalpost } from './journalpost';
import { Mulighet } from './mulighet';
import { StyledCard } from './styled-components';

export const AnkeDetails = ({
  frist,
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
}: IAnkestatus) => (
  <>
    <Journalpost title="Journalført anke" journalpost={journalpost} />

    <StyledCard title="Saksinfo" $gridArea="case" titleSize="medium">
      <DateInfoItem title="Mottatt NAV Klageinstans" date={mottattKlageinstans} />
      <DateInfoItem title="Frist" date={frist} />
      <Part title="Ankende part" part={klager} />
      <Part title="Fullmektig" part={fullmektig} />
      <Part
        title="Tildelt saksbehandler"
        part={
          tildeltSaksbehandler === null ? null : { id: tildeltSaksbehandler.navIdent, name: tildeltSaksbehandler.navn }
        }
      />
    </StyledCard>

    <Mulighet
      title="Valgt klagevedtak"
      fagsakId={fagsakId}
      fagsystemId={fagsystemId}
      sakenGjelder={sakenGjelder}
      vedtakDate={vedtakDate}
      ytelseId={ytelseId}
    />
  </>
);

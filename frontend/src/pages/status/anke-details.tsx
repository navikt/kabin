import React from 'react';
import { Svarbrev } from '@app/pages/status/svarbrev';
import { IAnkestatus } from '@app/types/status';
import { NavEmployee, Part } from './common-components';
import { DateInfoItem } from './date';
import { Journalpost } from './journalpost';
import { Mulighet } from './mulighet';
import { StyledCard } from './styled-components';

interface Props {
  id: string;
  anke: IAnkestatus;
}

export const AnkeDetails = ({ id, anke }: Props) => {
  const {
    journalpost,
    mottattKlageinstans,
    frist,
    klager,
    fullmektig,
    tildeltSaksbehandler,
    svarbrev,
    fagsakId,
    fagsystemId,
    sakenGjelder,
    vedtakDate,
    ytelseId,
  } = anke;

  return (
    <>
      <Journalpost title="Journalført anke" journalpost={journalpost} />

      <StyledCard title="Saksinfo" $gridArea="case" titleSize="medium">
        <DateInfoItem title="Mottatt NAV Klageinstans" date={mottattKlageinstans} />
        <DateInfoItem title="Frist" date={frist} />
        <Part title="Ankende part" part={klager} />
        <Part title="Fullmektig" part={fullmektig} />
        <NavEmployee title="Tildelt saksbehandler" employee={tildeltSaksbehandler} />
      </StyledCard>

      <Mulighet
        title="Valgt klagevedtak"
        fagsakId={fagsakId}
        fagsystemId={fagsystemId}
        sakenGjelder={sakenGjelder}
        vedtakDate={vedtakDate}
        ytelseId={ytelseId}
      />

      {svarbrev === null ? null : <Svarbrev svarbrev={svarbrev} id={id} />}
    </>
  );
};

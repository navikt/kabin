import { getKlagerTitle } from '@app/functions/get-klager-name';
import { NavEmployee, Part } from '@app/pages/status/common-components';
import { DateInfoItem, getDifference } from '@app/pages/status/date';
import { getDuration } from '@app/pages/status/duration';
import { Journalpost } from '@app/pages/status/journalpost';
import { StyledCard } from '@app/pages/status/layout';
import { Mulighet } from '@app/pages/status/mulighet';
import { Svarbrev } from '@app/pages/status/svarbrev';
import { type RegistreringType, SaksTypeEnum } from '@app/types/common';
import type { IAnkestatus, IBegjæringOmGjenopptakStatus, IKlagestatus, IOmgjøringskravstatus } from '@app/types/status';
import { parseISO } from 'date-fns';

interface Props {
  id: string;
  status: IAnkestatus | IKlagestatus | IOmgjøringskravstatus | IBegjæringOmGjenopptakStatus;
}

const getJournalpostTitle = (typeId: RegistreringType): string => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return 'Valgt journalpost';
    case SaksTypeEnum.ANKE:
      return 'Journalført anke';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'Journalført omgjøringskrav';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return 'Journalført begjæring om gjenopptak';
  }
};

const getMulighetTitle = (typeId: RegistreringType): string => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return 'Valgt klagevedtak';
    case SaksTypeEnum.ANKE:
      return 'Valgt ankevedtak';
    case SaksTypeEnum.OMGJØRINGSKRAV:
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return 'Valgt vedtak';
  }
};

export const StatusDetails = ({ id, status }: Props) => {
  const {
    typeId,
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
    varsletFrist,
    varsletFristUnits,
    varsletFristUnitTypeId,
  } = status;
  const journalpostTitle = getJournalpostTitle(typeId);
  const klagerTitle = getKlagerTitle(typeId);
  const mulighetTitle = getMulighetTitle(typeId);

  const mottattKlageinstansDate = parseISO(mottattKlageinstans);

  return (
    <>
      <Journalpost title={journalpostTitle} journalpost={journalpost} />

      <StyledCard title="Saksinfo" gridArea="case" titleSize="medium">
        {typeId === SaksTypeEnum.KLAGE ? (
          <DateInfoItem label="Mottatt vedtaksinstans" date={status.mottattVedtaksinstans} />
        ) : null}
        <DateInfoItem label="Mottatt Nav klageinstans" date={mottattKlageinstans} />
        <DateInfoItem label="Frist" date={frist}>
          {getDifference(mottattKlageinstansDate, parseISO(frist))}
        </DateInfoItem>
        <DateInfoItem label="Varslet frist" date={varsletFrist}>
          {varsletFristUnits === null || varsletFristUnitTypeId === null
            ? undefined
            : getDuration(varsletFristUnits, varsletFristUnitTypeId)}
        </DateInfoItem>
        <Part title={klagerTitle} part={klager} />
        <Part title="Fullmektig" part={fullmektig} />
        <NavEmployee title="Tildelt saksbehandler" employee={tildeltSaksbehandler} />
      </StyledCard>

      <Mulighet
        title={mulighetTitle}
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

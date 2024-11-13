import { NavEmployee, Part } from '@app/pages/status/common-components';
import { DateInfoItem, getDifference } from '@app/pages/status/date';
import { getDuration } from '@app/pages/status/duration';
import { Journalpost } from '@app/pages/status/journalpost';
import { Mulighet } from '@app/pages/status/mulighet';
import { StyledCard } from '@app/pages/status/styled-components';
import { Svarbrev } from '@app/pages/status/svarbrev';
import { SaksTypeEnum } from '@app/types/common';
import type { IAnkestatus, IKlagestatus, IOmgjøringskravstatus } from '@app/types/status';
import { parseISO } from 'date-fns';

interface Props {
  id: string;
  status: IAnkestatus | IKlagestatus | IOmgjøringskravstatus;
}

const getJournalpostTitle = (typeId: SaksTypeEnum) => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return 'Valgt journalpost';
    case SaksTypeEnum.ANKE:
      return 'Journalført anke';
    default:
      return 'Journalført omgjøringskrav';
  }
};

const getKlagerTitle = (typeId: SaksTypeEnum) => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return 'Klager';
    case SaksTypeEnum.ANKE:
      return 'Ankende part';
    default:
      return 'Den som krever omgjøring';
  }
};

const getMulighetTitle = (typeId: SaksTypeEnum) => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return 'Valgt klagevedtak';
    case SaksTypeEnum.ANKE:
      return 'Valgt ankevedtak';
    default:
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

      <StyledCard title="Saksinfo" $gridArea="case" titleSize="medium">
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

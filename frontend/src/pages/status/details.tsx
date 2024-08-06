import { parseISO } from 'date-fns';
import { getDuration } from '@app/pages/status/duration';
import { Svarbrev } from '@app/pages/status/svarbrev';
import { SaksTypeEnum } from '@app/types/common';
import { IAnkestatus, IKlagestatus } from '@app/types/status';
import { NavEmployee, Part } from './common-components';
import { DateInfoItem, getDifference } from './date';
import { Journalpost } from './journalpost';
import { Mulighet } from './mulighet';
import { StyledCard } from './styled-components';

interface Props {
  id: string;
  status: IAnkestatus | IKlagestatus;
}

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

  const isKlage = typeId === SaksTypeEnum.KLAGE;

  const journalpostTitle = isKlage ? 'Valgt journalpost' : 'Journalført anke';
  const klagerTitle = isKlage ? 'Klager' : 'Ankende part';
  const mulighetTitle = isKlage ? 'Valgt klagevedtak' : 'Valgt vedtak';

  const mottattKlageinstansDate = parseISO(mottattKlageinstans);

  return (
    <>
      <Journalpost title={journalpostTitle} journalpost={journalpost} />

      <StyledCard title="Saksinfo" $gridArea="case" titleSize="medium">
        {isKlage ? <DateInfoItem label="Mottatt vedtaksinstans" date={status.mottattVedtaksinstans} /> : null}
        <DateInfoItem label="Mottatt NAV Klageinstans" date={mottattKlageinstans} />
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

import { getMulighetDate, isValidMulighetDate } from '@app/components/muligheter/common/mulighet-date';
import { Row } from '@app/components/muligheter/common/table/row';
import { MulighetType, type OtherMulighetType } from '@app/components/muligheter/common/table/types';
import { useIsUploadedDocuments, useJournalpost } from '@app/hooks/use-journalpost';
import type { IBegjæringOmGjenopptakMulighet, IKlagemulighet, OtherMulighet } from '@app/types/mulighet';
import { Table } from '@navikt/ds-react';
import type { JSX } from 'react/jsx-runtime';

interface OtherMulighetProps {
  type: OtherMulighetType;
  muligheter: OtherMulighet[];
  columns: (keyof OtherMulighet)[];
}

interface KlagemulighetProps {
  type: MulighetType.KLAGE;
  muligheter: IKlagemulighet[];
  columns: (keyof IKlagemulighet)[];
}

interface BegjæringOmGjenopptakMulighetProps {
  type: MulighetType.BEGJÆRING_OM_GJENOPPTAK;
  muligheter: IBegjæringOmGjenopptakMulighet[];
  columns: (keyof IBegjæringOmGjenopptakMulighet)[];
}

type MulighetProps = OtherMulighetProps | KlagemulighetProps | BegjæringOmGjenopptakMulighetProps;
type Props = MulighetProps & { selectable: boolean };

export const MulighetRows = ({ type, columns, muligheter, ...p }: Props): JSX.Element => {
  const { data: journalpost } = useJournalpost();
  const isUploadedDocuments = useIsUploadedDocuments();

  const isValidDate = (date: string | null) =>
    isValidMulighetDate(date, isUploadedDocuments, journalpost?.datoOpprettet);

  // Klagemulighet has no date to validate - always valid.
  if (type === MulighetType.KLAGE) {
    return (
      <Table.Body>
        {muligheter.map((m) => (
          <Row key={m.id} mulighet={m} columns={columns} type={type} isValid {...p} />
        ))}
      </Table.Body>
    );
  }

  if (type === MulighetType.BEGJÆRING_OM_GJENOPPTAK) {
    return (
      <Table.Body>
        {muligheter.map((m) => (
          <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValidDate(getMulighetDate(m))} {...p} />
        ))}
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {muligheter.map((m) => (
        <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValidDate(getMulighetDate(m))} {...p} />
      ))}
    </Table.Body>
  );
};

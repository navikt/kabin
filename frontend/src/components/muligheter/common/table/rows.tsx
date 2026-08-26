import { isValidMulighetDate } from '@app/components/muligheter/common/mulighet-date';
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

type Props = OtherMulighetProps | KlagemulighetProps | BegjæringOmGjenopptakMulighetProps;

export const MulighetRows = ({ type, columns, muligheter }: Props): JSX.Element => {
  const { journalpost } = useJournalpost();
  const isUploadedDocuments = useIsUploadedDocuments();

  const isValidDate = (date: string | null) =>
    isValidMulighetDate(date, isUploadedDocuments, journalpost?.datoOpprettet);

  // Klagemulighet has no date to validate - always valid.
  if (type === MulighetType.KLAGE) {
    return (
      <Table.Body>
        {muligheter.map((m) => (
          <Row key={m.id} mulighet={m} columns={columns} type={type} isValid />
        ))}
      </Table.Body>
    );
  }

  if (type === MulighetType.BEGJÆRING_OM_GJENOPPTAK) {
    return (
      <Table.Body>
        {muligheter.map((m) => (
          <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValidDate(m.kjennelseMottatt)} />
        ))}
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {muligheter.map((m) => (
        <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValidDate(m.vedtakDate)} />
      ))}
    </Table.Body>
  );
};

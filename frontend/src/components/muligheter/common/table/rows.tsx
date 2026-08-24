import { Row } from '@app/components/muligheter/common/table/row';
import { MulighetType, type OtherMulighetType } from '@app/components/muligheter/common/table/types';
import { isDateAfter } from '@app/functions/date';
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

  const isValidOtherMulighet = (mulighet: OtherMulighet) => {
    if (mulighet.vedtakDate === null) {
      return true;
    }

    if (isUploadedDocuments) {
      return !isDateAfter(mulighet.vedtakDate, new Date().toISOString());
    }

    if (journalpost === undefined) {
      return false;
    }

    return !isDateAfter(mulighet.vedtakDate, journalpost.datoOpprettet);
  };

  const isValidGBMulighet = (mulighet: IBegjæringOmGjenopptakMulighet) => {
    if (mulighet.kjennelseMottatt === null) {
      return true;
    }

    if (isUploadedDocuments) {
      return !isDateAfter(mulighet.kjennelseMottatt, new Date().toISOString());
    }

    if (journalpost === undefined) {
      return false;
    }

    return !isDateAfter(mulighet.kjennelseMottatt, journalpost.datoOpprettet);
  };

  if (type === MulighetType.KLAGE) {
    return (
      <Table.Body>
        {muligheter.map((m) => (
          <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValidKlagemulighet} />
        ))}
      </Table.Body>
    );
  }

  if (type === MulighetType.BEGJÆRING_OM_GJENOPPTAK) {
    return (
      <Table.Body>
        {muligheter.map((m) => (
          <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={() => isValidGBMulighet(m)} />
        ))}
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {muligheter.map((m) => (
        <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={() => isValidOtherMulighet(m)} />
      ))}
    </Table.Body>
  );
};

// Klagemulighet has no validation - always valid
const isValidKlagemulighet = () => true;

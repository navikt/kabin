import { getMulighetDate, isValidMulighetDate } from '@app/components/muligheter/common/mulighet-date';
import { Row } from '@app/components/muligheter/common/table/row';
import { type MulighetMap, MulighetType } from '@app/components/muligheter/common/table/types';
import { useIsUploadedDocuments, useJournalpost } from '@app/hooks/use-journalpost';
import type { IMulighet } from '@app/types/mulighet';
import { Table } from '@navikt/ds-react';
import type { JSX } from 'react/jsx-runtime';

type Props = {
  [T in MulighetType]: {
    selectable: boolean;
    type: T;
    muligheter: MulighetMap[T][];
    columns: (keyof MulighetMap[T])[];
  };
}[MulighetType];

export const MulighetRows = (props: Props): JSX.Element => (
  <Table.Body>
    <Rows {...props} />
  </Table.Body>
);

// Every case renders the same row, but each one has to be listed separately for TS to keep
// `type`, `mulighet` and `columns` correlated.
const Rows = ({ type, columns, muligheter, selectable }: Props): JSX.Element[] => {
  const { data: journalpost } = useJournalpost();
  const isUploadedDocuments = useIsUploadedDocuments();

  const isValid = (mulighet: IMulighet) =>
    isValidMulighetDate(getMulighetDate(mulighet), isUploadedDocuments, journalpost?.datoOpprettet);

  switch (type) {
    // Klagemulighet has no date to validate - always valid.
    case MulighetType.KLAGE:
      return muligheter.map((m) => (
        <Row key={m.id} mulighet={m} columns={columns} type={type} isValid selectable={selectable} />
      ));
    case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
      return muligheter.map((m) => (
        <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValid(m)} selectable={selectable} />
      ));
    case MulighetType.ANKE:
      return muligheter.map((m) => (
        <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValid(m)} selectable={selectable} />
      ));
    case MulighetType.OMGJØRINGSKRAV:
      return muligheter.map((m) => (
        <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValid(m)} selectable={selectable} />
      ));
    case MulighetType.ADDITIONAL_KABAL_MULIGHET:
      return muligheter.map((m) => (
        <Row key={m.id} mulighet={m} columns={columns} type={type} isValid={isValid(m)} selectable={selectable} />
      ));
  }
};

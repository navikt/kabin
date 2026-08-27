import { MulighetHeaders } from '@app/components/muligheter/common/table/headers';
import { type MulighetMap, MulighetType } from '@app/components/muligheter/common/table/types';
import type { IBegjæringOmGjenopptakMulighet, IKlagemulighet, OtherMulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { Skeleton, Table } from '@navikt/ds-react';
import type { JSX } from 'react';

type LoadingCellsProps = {
  [T in MulighetType]: {
    type: T;
    columns: (keyof MulighetMap[T])[];
  };
}[MulighetType];

type LoadingRowsProps = LoadingCellsProps & { selectable: boolean };

type Props = LoadingRowsProps & { label: string };

// The rest of `props` is spread as a whole to keep `type` and `columns` correlated.
export const LoadingMuligheter = ({ label, ...props }: Props) => (
  <Table size="small" id={ValidationFieldNames.MULIGHET} aria-label={label}>
    <MulighetHeaders {...props} />
    <LoadingRows {...props} />
  </Table>
);

const LoadingRows = (props: LoadingRowsProps) => (
  <Table.Body>
    <LoadingRow {...props} />
    <LoadingRow {...props} />
    <LoadingRow {...props} />
    <LoadingRow {...props} />
  </Table.Body>
);

const LoadingRow = ({ selectable, ...props }: LoadingRowsProps) => (
  <Table.Row>
    <LoadingCells {...props} />
    {selectable ? <SelectRowButton /> : null}
  </Table.Row>
);

// The three groups render identically, but TS needs the correlated cases to narrow `columns`
// together with `type`.
const LoadingCells = ({ type, columns }: LoadingCellsProps): JSX.Element[] => {
  switch (type) {
    case MulighetType.KLAGE:
      return columns.map((column) => (
        <Table.DataCell key={column} style={{ width: getKlageColumnWidth(column) }}>
          <Skeleton variant="text" width="100%" />
        </Table.DataCell>
      ));
    case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
      return columns.map((column) => (
        <Table.DataCell key={column} style={{ width: getBegjæringOmGjenopptakMulighetColumnWidth(column) }}>
          <Skeleton variant="text" width="100%" />
        </Table.DataCell>
      ));
    case MulighetType.ADDITIONAL_KABAL_MULIGHET:
    case MulighetType.ANKE:
    case MulighetType.OMGJØRINGSKRAV:
      return columns.map((column) => (
        <Table.DataCell key={column} style={{ width: getOtherColumnWidth(column) }}>
          <Skeleton variant="text" width="100%" />
        </Table.DataCell>
      ));
  }
};

const SelectRowButton = () => (
  <Table.DataCell className="text-center">
    <Skeleton variant="text" width={60} />
  </Table.DataCell>
);

const getOtherColumnWidth = (column: keyof OtherMulighet): number => {
  switch (column) {
    case 'typeId':
      return 230;
    case 'fagsakId':
      return 80;
    case 'temaId':
      return 220;
    case 'ytelseId':
      return 250;
    case 'vedtakDate':
    case 'kjennelseMottatt':
      return 100;
    case 'originalFagsystemId':
      return 120;
    case 'sourceOfExistingBehandlinger':
      return 100;
    case 'currentFagsystemId':
    case 'fullmektig':
    case 'hjemmelIdList':
    case 'klager':
    case 'mulighetTypeId':
    case 'previousSaksbehandler':
    case 'requiresGosysOppgave':
    case 'id':
    case 'sakenGjelder':
      throw new Error(`Unsupported key: ${column} for getOtherColumnWidth`);
  }
};

const getKlageColumnWidth = (column: keyof IKlagemulighet): number => {
  switch (column) {
    case 'fagsakId':
      return 150;
    case 'temaId':
      return 190;
    case 'vedtakDate':
      return 270;
    case 'klageBehandlendeEnhet':
      return 290;
    case 'originalFagsystemId':
      return 200;
    case 'currentFagsystemId':
    case 'requiresGosysOppgave':
    case 'mulighetTypeId':
    case 'id':
    case 'sakenGjelder':
      throw new Error(`Unsupported key: ${column} for getKlageColumnWidth`);
  }
};

const getBegjæringOmGjenopptakMulighetColumnWidth = (column: keyof IBegjæringOmGjenopptakMulighet): number => {
  switch (column) {
    case 'kjennelseMottatt':
      return 100;
    default:
      return getOtherColumnWidth(column);
  }
};

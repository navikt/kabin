import { type MulighetMap, MulighetType } from '@app/components/muligheter/common/table/types';
import { Table } from '@navikt/ds-react';
import type { JSX } from 'react/jsx-runtime';

type HeaderCellProps = {
  [T in MulighetType]: {
    type: T;
    column: keyof MulighetMap[T];
  };
}[MulighetType];

const HeaderCell = ({ column, type }: HeaderCellProps): JSX.Element => {
  switch (column) {
    case 'typeId':
      return <Table.HeaderCell>Type</Table.HeaderCell>;
    case 'ytelseId':
      return <Table.HeaderCell>Ytelse</Table.HeaderCell>;
    case 'sourceOfExistingBehandlinger':
      return <Table.HeaderCell />;
    case 'kjennelseMottatt':
      return <Table.HeaderCell>Kjennelsesdato</Table.HeaderCell>;
    case 'klageBehandlendeEnhet':
      return <Table.HeaderCell>Behandlende enhet</Table.HeaderCell>;
    case 'fagsakId':
      return <Table.HeaderCell>Fagsak-ID</Table.HeaderCell>;
    case 'temaId':
      return <Table.HeaderCell>Tema</Table.HeaderCell>;
    case 'originalFagsystemId':
      return <Table.HeaderCell>Fagsystem</Table.HeaderCell>;
    case 'vedtakDate':
      return <Table.HeaderCell>{type === MulighetType.KLAGE ? 'Vedtak/innstilling' : 'Vedtaksdato'}</Table.HeaderCell>;
    case 'fullmektig':
    case 'hjemmelIdList':
    case 'klager':
    case 'mulighetTypeId':
    case 'previousSaksbehandler':
    case 'currentFagsystemId':
    case 'id':
    case 'sakenGjelder':
    case 'requiresGosysOppgave':
      throw new Error(`Unsupported key: ${column} for HeaderCell`);
  }
};

type HeaderCellsProps = {
  [T in MulighetType]: {
    type: T;
    columns: (keyof MulighetMap[T])[];
  };
}[MulighetType];

type Props = HeaderCellsProps & { selectable: boolean };

// The rest of `props` is spread as a whole to keep `type` and `columns` correlated.
export const MulighetHeaders = ({ selectable, ...props }: Props) => (
  <Table.Header className="sticky top-0 z-1 bg-ax-bg-default">
    <Table.Row className="whitespace-nowrap">
      <HeaderCells {...props} />

      {selectable ? <Table.HeaderCell /> : null}
    </Table.Row>
  </Table.Header>
);

// Every case renders the same header cells, but each one has to be listed separately for TS to
// keep `type` and `column` correlated.
const HeaderCells = ({ type, columns }: HeaderCellsProps): JSX.Element[] => {
  switch (type) {
    case MulighetType.KLAGE:
      return columns.map((column) => <HeaderCell key={column} column={column} type={type} />);
    case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
      return columns.map((column) => <HeaderCell key={column} column={column} type={type} />);
    case MulighetType.ANKE:
      return columns.map((column) => <HeaderCell key={column} column={column} type={type} />);
    case MulighetType.OMGJØRINGSKRAV:
      return columns.map((column) => <HeaderCell key={column} column={column} type={type} />);
    case MulighetType.ADDITIONAL_KABAL_MULIGHET:
      return columns.map((column) => <HeaderCell key={column} column={column} type={type} />);
  }
};

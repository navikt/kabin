import { MulighetType, type OtherMulighetType } from '@app/components/muligheter/common/table/types';
import type { IBegjæringOmGjenopptakMulighet, IKlagemulighet, OtherMulighet } from '@app/types/mulighet';
import { Table } from '@navikt/ds-react';
import type { JSX } from 'react/jsx-runtime';

interface OtherMulighetHeaderCellProps {
  type: OtherMulighetType;
  column: keyof OtherMulighet;
}

interface BegjæringOmGjenopptakMulighetHeaderCellProps {
  type: MulighetType.BEGJÆRING_OM_GJENOPPTAK;
  column: keyof IBegjæringOmGjenopptakMulighet;
}

interface KlagemulighetHeaderCellProps {
  type: MulighetType.KLAGE;
  column: keyof IKlagemulighet;
}

type HeaderCellProps =
  | OtherMulighetHeaderCellProps
  | KlagemulighetHeaderCellProps
  | BegjæringOmGjenopptakMulighetHeaderCellProps;

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
    case 'previousSaksbehandler':
    case 'currentFagsystemId':
    case 'id':
    case 'sakenGjelder':
    case 'requiresGosysOppgave':
      throw new Error(`Unsupported key: ${column} for HeaderCell`);
  }
};

interface OtherMulighetProps {
  columns: (keyof OtherMulighet)[];
  type: OtherMulighetType;
}

interface KlagemulighetProps {
  columns: (keyof IKlagemulighet)[];
  type: MulighetType.KLAGE;
}

interface BegjæringOmGjenopptakProps {
  columns: (keyof IBegjæringOmGjenopptakMulighet)[];
  type: MulighetType.BEGJÆRING_OM_GJENOPPTAK;
}

type Props = OtherMulighetProps | KlagemulighetProps | BegjæringOmGjenopptakProps;

export const MulighetHeaders = (props: Props) => (
  <Table.Header className="sticky top-0 z-1 bg-ax-bg-default">
    <Table.Row className="whitespace-nowrap">
      <HeaderCells {...props} />

      {/* Select row button */}
      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>
);

const HeaderCells = ({ columns, type }: Props): JSX.Element[] => {
  switch (type) {
    case MulighetType.KLAGE:
      return columns.map((column) => <HeaderCell key={column} column={column} type={type} />);
    case MulighetType.BEGJÆRING_OM_GJENOPPTAK:
      return columns.map((column) => <HeaderCell key={column} column={column} type={type} />);
    case MulighetType.ADDITIONAL_KABAL_MULIGHET:
    case MulighetType.ANKE:
    case MulighetType.OMGJØRINGSKRAV:
      return columns.map((column) => <HeaderCell key={column} column={column} type={type} />);
  }
};

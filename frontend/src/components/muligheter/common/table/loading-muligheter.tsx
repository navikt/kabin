import { MulighetHeaders } from '@app/components/muligheter/common/table/headers';
import { MulighetType, type OtherMulighetType } from '@app/components/muligheter/common/table/types';
import type { IBegjæringOmGjenopptakMulighet, IKlagemulighet, OtherMulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { Skeleton, Table } from '@navikt/ds-react';
import type { JSX } from 'react';

interface OtherMuligheterProps {
  type: OtherMulighetType;
  label: string;
  columns: (keyof OtherMulighet)[];
}

interface KlagemuligheterProps {
  type: MulighetType.KLAGE;
  label: string;
  columns: (keyof IKlagemulighet)[];
}

interface BegjæringOmGjenopptakMuligheterProps {
  type: MulighetType.BEGJÆRING_OM_GJENOPPTAK;
  label: string;
  columns: (keyof IBegjæringOmGjenopptakMulighet)[];
}

type Props = OtherMuligheterProps | KlagemuligheterProps | BegjæringOmGjenopptakMuligheterProps;

export const LoadingMuligheter = ({ label, ...props }: Props) => (
  <Table size="small" id={ValidationFieldNames.MULIGHET} aria-label={label}>
    <MulighetHeaders {...props} />
    <LoadingRows {...props} />
  </Table>
);

interface LoadingOtherMuligheter {
  type: OtherMulighetType;
  columns: (keyof OtherMulighet)[];
}

interface LoadingBegjæringOmGjenopptakMuligheter {
  type: MulighetType.BEGJÆRING_OM_GJENOPPTAK;
  columns: (keyof IBegjæringOmGjenopptakMulighet)[];
}

interface LoadingKlagemuligheter {
  type: MulighetType.KLAGE;
  columns: (keyof IKlagemulighet)[];
}

type LoadingRowsProps = LoadingOtherMuligheter | LoadingKlagemuligheter | LoadingBegjæringOmGjenopptakMuligheter;

const LoadingRows = (props: LoadingRowsProps) => (
  <Table.Body>
    <LoadingRow {...props} />
    <LoadingRow {...props} />
    <LoadingRow {...props} />
    <LoadingRow {...props} />
  </Table.Body>
);

const LoadingRow = (props: LoadingRowsProps) => (
  <Table.Row>
    <LoadingCells {...props} />
    <SelectRowButton />
  </Table.Row>
);

const LoadingCells = ({ columns, type }: LoadingRowsProps): JSX.Element[] => {
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

import { TypeName } from '@app/components/muligheter/common/type-name';
import { UsedCount } from '@app/components/muligheter/common/used-count';
import { YtelseTag } from '@app/components/ytelse-tag/ytelse-tag';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId, useVedtaksenhetName } from '@app/hooks/kodeverk';
import type { IBegjæringOmGjenopptakMulighet, IKlagemulighet, OtherMulighet } from '@app/types/mulighet';
import { Table, Tag } from '@navikt/ds-react';
import type { JSX } from 'react/jsx-runtime';

interface KlagemulighetCellProps {
  column: keyof IKlagemulighet;
  mulighet: IKlagemulighet;
}

interface OtherMulighetCellProps {
  column: keyof OtherMulighet;
  mulighet: OtherMulighet;
}

interface BegjæringOmGjenopptakCellProps {
  column: keyof IBegjæringOmGjenopptakMulighet;
  mulighet: IBegjæringOmGjenopptakMulighet;
}

type Props = OtherMulighetCellProps | KlagemulighetCellProps | BegjæringOmGjenopptakCellProps;

export const Cell = ({ column, mulighet }: Props): JSX.Element => {
  switch (column) {
    case 'klageBehandlendeEnhet':
      return (
        <Table.DataCell>
          <VedtaksenhetName vedtaksenhetId={mulighet.klageBehandlendeEnhet} />
        </Table.DataCell>
      );
    case 'vedtakDate':
      return <Table.DataCell>{isoDateToPretty(mulighet.vedtakDate) ?? 'Ukjent'}</Table.DataCell>;
    case 'typeId':
      return (
        <Table.DataCell>
          <TypeName typeId={mulighet.typeId} />
        </Table.DataCell>
      );
    case 'ytelseId':
      return (
        <Table.DataCell>
          <YtelseTag ytelseId={mulighet.ytelseId} />
        </Table.DataCell>
      );
    case 'sourceOfExistingBehandlinger':
      return (
        <Table.DataCell>
          <UsedCount sourceOfExistingBehandlinger={mulighet.sourceOfExistingBehandlinger} />
        </Table.DataCell>
      );
    case 'kjennelseMottatt':
      return <Table.DataCell>{isoDateToPretty(mulighet.kjennelseMottatt) ?? ''} </Table.DataCell>;
    case 'fagsakId':
      return <Table.DataCell>{mulighet.fagsakId}</Table.DataCell>;
    case 'temaId':
      return (
        <Table.DataCell>
          <TemaTag temaId={mulighet.temaId} />
        </Table.DataCell>
      );
    case 'originalFagsystemId':
      return (
        <Table.DataCell>
          <FagsystemName fagsystemId={mulighet.originalFagsystemId} />
        </Table.DataCell>
      );
    case 'currentFagsystemId':
    case 'requiresGosysOppgave':
    case 'sakenGjelder':
    case 'id':
    case 'fullmektig':
    case 'hjemmelIdList':
    case 'klager':
    case 'previousSaksbehandler':
      throw new Error(`Unsupported key: ${column} for Cell`);
  }
};

const TemaTag = ({ temaId }: { temaId: string }) => (
  <Tag data-color="info" variant="outline" size="small">
    {useFullTemaNameFromId(temaId)}
  </Tag>
);

const FagsystemName = ({ fagsystemId }: { fagsystemId: string }) => useFagsystemName(fagsystemId);
const VedtaksenhetName = ({ vedtaksenhetId }: { vedtaksenhetId: string }) => useVedtaksenhetName(vedtaksenhetId);

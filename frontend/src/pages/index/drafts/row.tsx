import { Table } from '@navikt/ds-react';
import { useCallback } from 'react';
import { TableRow } from '@app/pages/index/table-components/clickable-row';
import { DateTime } from '@app/pages/index/table-components/datetime';
import { OpenButton } from '@app/pages/index/table-components/open';
import { SakenGjelder } from '@app/pages/index/table-components/saken-gjelder';
import { Type } from '@app/pages/index/table-components/type';
import { Ytelse } from '@app/pages/index/table-components/ytelse';
import { useLazyGetArkiverteDokumenterQuery } from '@app/redux/api/journalposter';
import { useLazyGetAnkemuligheterQuery, useLazyGetKlagemuligheterQuery } from '@app/redux/api/muligheter';
import { DraftRegistrering } from '@app/redux/api/registreringer/types';
import { SaksTypeEnum } from '@app/types/common';

export const DraftRow = ({ registrering }: { registrering: DraftRegistrering }) => {
  const [prefetchDocuments] = useLazyGetArkiverteDokumenterQuery();
  const [prefetchKlagemuligheter] = useLazyGetKlagemuligheterQuery();
  const [prefetchAnkemuligheter] = useLazyGetAnkemuligheterQuery();

  const { id, sakenGjelderValue, typeId, created, modified, overstyringer } = registrering;
  const { ytelseId } = overstyringer;

  const path = `/registrering/${id}`;

  const prepare = useCallback(() => {
    if (sakenGjelderValue === null) {
      return;
    }

    prefetchDocuments(sakenGjelderValue, true);

    if (typeId === null) {
      return;
    }

    switch (typeId) {
      case SaksTypeEnum.KLAGE: {
        prefetchKlagemuligheter(sakenGjelderValue, true);
        break;
      }
      case SaksTypeEnum.ANKE: {
        prefetchAnkemuligheter(sakenGjelderValue, true);
        break;
      }
    }
  }, [prefetchAnkemuligheter, prefetchDocuments, prefetchKlagemuligheter, sakenGjelderValue, typeId]);

  return (
    <TableRow path={path} onMouseEnter={prepare}>
      <SakenGjelder id={sakenGjelderValue} />

      <Table.DataCell>
        <Type typeId={typeId} />
      </Table.DataCell>

      <Table.DataCell>
        <Ytelse ytelseId={ytelseId} />
      </Table.DataCell>

      <Table.DataCell>
        <DateTime dateTime={created} />
      </Table.DataCell>

      <Table.DataCell>
        <DateTime dateTime={modified} />
      </Table.DataCell>

      <Table.DataCell>
        <OpenButton path={path}>Åpne</OpenButton>
      </Table.DataCell>
    </TableRow>
  );
};

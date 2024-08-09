import { Table } from '@navikt/ds-react';
import { ExternalLinkButton } from '@app/components/link-button/link-button';
import { KABAL_URL } from '@app/constants';
import { TableRow } from '@app/pages/index/table-components/clickable-row';
import { DateTime } from '@app/pages/index/table-components/datetime';
import { OpenButton } from '@app/pages/index/table-components/open';
import { SakenGjelder } from '@app/pages/index/table-components/saken-gjelder';
import { Type } from '@app/pages/index/table-components/type';
import { Ytelse } from '@app/pages/index/table-components/ytelse';
import { FinishedRegistrering } from '@app/redux/api/registreringer/types';
import { usePrefetch } from '@app/redux/api/status';
import { SaksTypeEnum } from '@app/types/common';

export const FinishedRow = ({ registrering }: { registrering: FinishedRegistrering }) => {
  const { id, sakenGjelderValue, typeId, overstyringer, created, finished, behandlingId } = registrering;
  const prefetchStatus = usePrefetch(typeId === SaksTypeEnum.KLAGE ? 'getKlageStatus' : 'getAnkeStatus');
  const { ytelseId } = overstyringer;

  const path = `/registrering/${id}/status`;

  return (
    <TableRow path={path} onMouseEnter={() => prefetchStatus(behandlingId)}>
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
        <DateTime dateTime={finished} />
      </Table.DataCell>

      <Table.DataCell>
        <OpenButton path={path}>Status</OpenButton>
      </Table.DataCell>

      <Table.DataCell>
        <OpenKabal {...registrering} />
      </Table.DataCell>
    </TableRow>
  );
};

const OpenKabal = ({ typeId, behandlingId }: FinishedRegistrering) => (
  <ExternalLinkButton
    href={`${KABAL_URL}/${typeId === SaksTypeEnum.ANKE ? 'ankebehandling' : 'klagebehandling'}/${behandlingId}`}
    variant="secondary"
    size="small"
  >
    Åpne behandling i Kabal
  </ExternalLinkButton>
);

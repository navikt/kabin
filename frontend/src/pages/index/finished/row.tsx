import { ExternalLinkButton } from '@app/components/link-button/link-button';
import { SeUtfylling } from '@app/components/se-utfylling-button/se-utfylling-button';
import { YtelseTag } from '@app/components/ytelse-tag/ytelse-tag';
import { KABAL_URL } from '@app/constants';
import { TableRow } from '@app/pages/index/table-components/clickable-row';
import { DateTime } from '@app/pages/index/table-components/datetime';
import { OpenButton } from '@app/pages/index/table-components/open';
import { SakenGjelder } from '@app/pages/index/table-components/saken-gjelder';
import { Type } from '@app/pages/index/table-components/type';
import type { FinishedRegistreringListItem } from '@app/redux/api/registreringer/types';
import { usePrefetch } from '@app/redux/api/status';
import { SaksTypeEnum } from '@app/types/common';
import { HStack, Table } from '@navikt/ds-react';

export const FinishedRow = ({ registrering }: { registrering: FinishedRegistreringListItem }) => {
  const { id, sakenGjelderValue, typeId, ytelseId, created, finished, behandlingId } = registrering;
  const prefetchStatus = usePrefetch('getStatus');

  const path = `/registrering/${id}/status`;

  return (
    <TableRow path={path} onMouseEnter={() => prefetchStatus(behandlingId)}>
      <SakenGjelder id={sakenGjelderValue} />

      <Table.DataCell>
        <Type typeId={typeId} />
      </Table.DataCell>

      <Table.DataCell>
        <YtelseTag ytelseId={ytelseId} />
      </Table.DataCell>

      <Table.DataCell>
        <DateTime dateTime={created} />
      </Table.DataCell>

      <Table.DataCell>
        <DateTime dateTime={finished} />
      </Table.DataCell>

      <Table.DataCell>
        <HStack justify="center" gap="space-4">
          <OpenButton path={path}>Status</OpenButton>
          <SeUtfylling registreringId={registrering.id} />
          <OpenKabal {...registrering} />
        </HStack>
      </Table.DataCell>
    </TableRow>
  );
};

const OpenKabal = ({ typeId, behandlingId }: FinishedRegistreringListItem) => (
  <ExternalLinkButton
    href={`${KABAL_URL}/${typeId === SaksTypeEnum.ANKE ? 'ankebehandling' : 'klagebehandling'}/${behandlingId}`}
    variant="secondary-neutral"
    size="small"
  >
    Åpne behandling i Kabal
  </ExternalLinkButton>
);

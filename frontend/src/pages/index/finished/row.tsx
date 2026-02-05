import { ExternalLinkButton } from '@app/components/link-button/link-button';
import { SeUtfylling } from '@app/components/se-utfylling-button/se-utfylling-button';
import { TypeTag } from '@app/components/type-tag/type-tag';
import { YtelseTag } from '@app/components/ytelse-tag/ytelse-tag';
import { KABAL_URL } from '@app/constants';
import { TableRow } from '@app/pages/index/table-components/clickable-row';
import { DateTime } from '@app/pages/index/table-components/datetime';
import { OpenButton } from '@app/pages/index/table-components/open';
import { SakenGjelder } from '@app/pages/index/table-components/saken-gjelder';
import type { FinishedRegistreringListItem } from '@app/redux/api/registreringer/types';
import { usePrefetch } from '@app/redux/api/status';
import { HStack, Table } from '@navikt/ds-react';

export const FinishedRow = ({ registrering }: { registrering: FinishedRegistreringListItem }) => {
  const { id, sakenGjelderValue, typeId, ytelseId, created, finished, behandlingId } = registrering;
  const prefetchStatus = usePrefetch('getStatus');

  const path = `/registrering/${id}/status`;

  return (
    <TableRow path={path} onMouseEnter={() => prefetchStatus(behandlingId)}>
      <SakenGjelder id={sakenGjelderValue} />

      <Table.DataCell>
        <TypeTag typeId={typeId} />
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

const OpenKabal = ({ behandlingId }: FinishedRegistreringListItem) => (
  <ExternalLinkButton href={`${KABAL_URL}/behandling/${behandlingId}`} variant="secondary-neutral" size="small">
    Åpne behandling i Kabal
  </ExternalLinkButton>
);

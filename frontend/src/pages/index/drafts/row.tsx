import { GoToRegistrering } from '@app/components/go-to-registrering-button/go-to-registrering-button';
import { TypeTag } from '@app/components/type-tag/type-tag';
import { YtelseTag } from '@app/components/ytelse-tag/ytelse-tag';
import { TableRow } from '@app/pages/index/table-components/clickable-row';
import { DateTime } from '@app/pages/index/table-components/datetime';
import { SakenGjelder } from '@app/pages/index/table-components/saken-gjelder';
import { useDeleteRegistreringMutation } from '@app/redux/api/registreringer/main';
import type { DraftRegistreringListItem } from '@app/redux/api/registreringer/types';
import { Button, HStack, Table } from '@navikt/ds-react';

export const DraftRow = ({ registrering }: { registrering: DraftRegistreringListItem }) => {
  const { id, sakenGjelderValue, typeId, created, modified, ytelseId } = registrering;

  const path = `/registrering/${id}`;

  return (
    <TableRow path={path}>
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
        <DateTime dateTime={modified} />
      </Table.DataCell>

      <Table.DataCell>
        <HStack justify="center" gap="space-4">
          <GoToRegistrering registreringId={registrering.id}>Fortsett</GoToRegistrering>
          <DeleteButton id={registrering.id} />
        </HStack>
      </Table.DataCell>
    </TableRow>
  );
};

const DeleteButton = ({ id }: { id: string }) => {
  const [deleteRegistrering, { isLoading }] = useDeleteRegistreringMutation();

  return (
    <Button
      variant="danger"
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        deleteRegistrering(id);
      }}
      loading={isLoading}
    >
      Slett
    </Button>
  );
};

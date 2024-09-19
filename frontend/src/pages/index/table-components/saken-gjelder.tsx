import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { useGetPartQuery } from '@app/redux/api/part';
import { CopyButton, Skeleton, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';

interface Props {
  id: string | null;
}

export const SakenGjelder = ({ id }: Props) => {
  const { data, isSuccess, isLoading } = useGetPartQuery(id ?? skipToken);

  if (id === null) {
    return (
      <>
        <Table.DataCell>
          <i>Ingen</i>
        </Table.DataCell>

        <Table.DataCell />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Table.DataCell>
          <Skeleton variant="text" width={220} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton variant="rounded" width={140} height={32} />
        </Table.DataCell>
      </>
    );
  }

  if (!isSuccess) {
    return null;
  }

  if (data === null) {
    return (
      <>
        <Table.DataCell>
          <i>Ukjent</i>
        </Table.DataCell>

        <Table.DataCell />
      </>
    );
  }

  return (
    <>
      <Table.DataCell>
        <CopyButton
          copyText={data.name ?? ''}
          text={data.name ?? '<mangler>'}
          variant="neutral"
          size="small"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
        />
      </Table.DataCell>

      <Table.DataCell>
        <CopyPartIdButton id={id} />
      </Table.DataCell>
    </>
  );
};

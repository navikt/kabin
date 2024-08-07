import { Heading, Skeleton, Table } from '@navikt/ds-react';
import { CreateRegistreringButton } from '@app/components/create-registrering-button/create-registrering-button';
import { DraftsHeaders } from '@app/pages/index/drafts/headers';
import { DraftsTable } from '@app/pages/index/drafts/table';
import { Container } from '@app/pages/index/styled-components';
import { useGetUferdigeRegistreringerQuery } from '@app/redux/api/registreringer/queries';

export const Drafts = () => (
  <Container>
    <Heading level="1" size="medium" spacing>
      Påbegynte registreringer
    </Heading>

    <CreateRegistreringButton />

    <Rows />
  </Container>
);

const Rows = () => {
  const { data, isLoading } = useGetUferdigeRegistreringerQuery();

  if (isLoading || data === undefined) {
    return <SkeletonTable />;
  }

  return <DraftsTable registreringer={data} />;
};

const SkeletonTable = () => (
  <Table zebraStripes size="small">
    <DraftsHeaders />

    <Table.Body>
      <Table.Row>
        <Table.DataCell>
          <Skeleton variant="text" width={220} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton variant="rounded" width={140} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton variant="rectangle" width={52} height={24} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton variant="rectangle" width={200} height={24} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton variant="text" width={147} height={25} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton variant="text" width={147} height={25} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton variant="rounded" width={59} height={32} />
        </Table.DataCell>
      </Table.Row>
    </Table.Body>
  </Table>
);

import { FinishedHeaders } from '@app/pages/index/finished/headers';
import { FinishedTable } from '@app/pages/index/finished/table';
import { Container } from '@app/pages/index/styled-components';
import { useGetFerdigeRegistreringerQuery } from '@app/redux/api/registreringer/queries';
import { Heading, Skeleton, Table } from '@navikt/ds-react';

export const Finished = () => (
  <Container>
    <Heading level="1" size="medium" spacing>
      Ferdige registreringer siste 7 dager
    </Heading>

    <Rows />
  </Container>
);

const Rows = () => {
  const { data, isLoading } = useGetFerdigeRegistreringerQuery();

  if (isLoading || data === undefined) {
    return <SkeletonTable />;
  }

  return <FinishedTable registreringer={data} />;
};

const SkeletonTable = () => (
  <Table zebraStripes size="small">
    <FinishedHeaders />

    <Table.Body>
      <Table.Row>
        <Table.DataCell>
          <Skeleton width={220} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={140} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={52} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={200} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={147} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={147} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={59} height={32} />
        </Table.DataCell>

        <Table.DataCell>
          <Skeleton width={120} height={32} />
        </Table.DataCell>
      </Table.Row>
    </Table.Body>
  </Table>
);

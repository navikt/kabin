import { BodyShort, Button, Heading, Pagination, Skeleton, SortState, Table, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from 'styled-components';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { SakenGjelderIcon } from '@app/components/overstyringer/icons';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useGetPartQuery } from '@app/redux/api/part';
import { Registrering } from '@app/redux/api/registreringer/types';
import { SaksTypeEnum } from '@app/types/common';
import { TYPE_NAME } from '@app/types/mulighet';

interface Props extends RegistreringerTableProps {
  heading: string;
}

const Type = ({ typeId }: { typeId: string | null }) => {
  switch (typeId) {
    case null:
      return <i>Ikke satt</i>;
    case SaksTypeEnum.KLAGE:
      return (
        <Tag variant="info" size="small">
          Klage
        </Tag>
      );
    case SaksTypeEnum.ANKE:
      return (
        <Tag variant="alt1" size="small">
          Anke
        </Tag>
      );
  }
};

const Headers = () => (
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Saken gjelder</Table.ColumnHeader>
      <Table.ColumnHeader sortKey="typeId" sortable>
        Type
      </Table.ColumnHeader>
      <Table.ColumnHeader sortKey="modified" sortable>
        Sist endret
      </Table.ColumnHeader>
      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>
);

const SkeletonTable = () => (
  <Table zebraStripes size="small">
    <Headers />
    <Table.Body>
      <Table.Row>
        <Table.DataCell>
          <Skeleton />
        </Table.DataCell>
        <Table.DataCell>
          <Skeleton />
        </Table.DataCell>
        <Table.DataCell>
          <Skeleton />
        </Table.DataCell>
      </Table.Row>
    </Table.Body>
  </Table>
);

export const Registreringer = ({ registreringer, isLoading, heading }: Props) => (
  <Container>
    <Heading level="1" size="medium" spacing>
      {heading}
    </Heading>
    <RegistreringerTable registreringer={registreringer} isLoading={isLoading} />
  </Container>
);

const ROWS_PER_PAGE = 10;

type SortProp = keyof Pick<Registrering, 'typeId' | 'modified'>;
const isSortProp = (key: string): key is SortProp => ['typeId', 'modified'].includes(key);

interface RegistreringerTableProps {
  registreringer: Registrering[];
  isLoading: boolean;
}

const RegistreringerTable = ({ registreringer, isLoading }: RegistreringerTableProps) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | undefined>();
  const numberOfPages = useMemo(() => Math.ceil(registreringer.length / ROWS_PER_PAGE), [registreringer]);

  const sorted = useMemo(
    () =>
      registreringer.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE).toSorted((a, b) => {
        if (sort === undefined || sort.direction === 'none' || !isSortProp(sort.orderBy)) {
          return 0;
        }

        const aVal = a[sort.orderBy] ?? '';
        const bVal = b[sort.orderBy] ?? '';

        if (sort.direction === 'ascending') {
          return aVal.localeCompare(bVal);
        }

        return bVal.localeCompare(aVal);
      }),
    [registreringer, page, sort],
  );

  const handleSort = (sortKey?: string) => {
    if (sortKey === undefined) {
      return setSort(undefined);
    }

    setSort({ orderBy: sortKey, direction: sort?.direction === 'ascending' ? 'descending' : 'ascending' });
  };

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (registreringer.length === 0) {
    return <BodyShort>Ingen registreringer</BodyShort>;
  }

  return (
    <TableAndPagination>
      <Table zebraStripes size="small" sort={sort} onSortChange={handleSort}>
        <Headers />
        <Table.Body>
          {sorted.map((r) => (
            <Row key={r.id} registrering={r} />
          ))}
        </Table.Body>
      </Table>
      <Pagination page={page} onPageChange={setPage} count={numberOfPages} size="small" />
    </TableAndPagination>
  );
};

const Row = ({ registrering }: { registrering: Registrering }) => (
  <Table.Row>
    <Table.DataCell>
      <SakenGjelder id={registrering.sakenGjelderValue} />
    </Table.DataCell>
    <Table.DataCell>
      <Type typeId={registrering.typeId} />
    </Table.DataCell>
    <Table.DataCell>
      <time dateTime={registrering.modified}>{isoDateTimeToPretty(registrering.modified)}</time>
    </Table.DataCell>
    <Table.DataCell>
      <Button as={RouterLink} to={`/registrering/${registrering.id}`} size="small">
        Åpne
      </Button>
    </Table.DataCell>
  </Table.Row>
);

const SakenGjelder = ({ id }: { id: string | null }) => {
  const { data: part } = useGetPartQuery(id ?? skipToken);

  if (id === null) {
    return <i>Ingen</i>;
  }

  return (
    <SakenGjelderContainer>
      {part === undefined ? (
        <Skeleton />
      ) : (
        <>
          {part.name}
          <CopyPartIdButton id={id} />
        </>
      )}
    </SakenGjelderContainer>
  );
};

const Container = styled.section`
  width: 100%;
`;

const TableAndPagination = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const SakenGjelderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

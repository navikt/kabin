import { Table } from '@navikt/ds-react';
import { StyledTableHeader } from '@app/components/muligheter/common/styled-components';

export const TableHeaders = () => (
  <StyledTableHeader>
    <Table.Row style={{ whiteSpace: 'nowrap' }}>
      <Table.HeaderCell>Fagsak-ID</Table.HeaderCell>
      <Table.HeaderCell>Tema</Table.HeaderCell>
      <Table.HeaderCell>Vedtak/innstilling</Table.HeaderCell>
      <Table.HeaderCell>Behandlende enhet</Table.HeaderCell>
      <Table.HeaderCell>Fagsystem</Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Row>
  </StyledTableHeader>
);

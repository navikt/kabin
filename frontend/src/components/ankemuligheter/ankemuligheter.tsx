import { Collapse } from '@navikt/ds-icons';
import { Button, Heading, Table } from '@navikt/ds-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { IBehandling } from '../../types/behandling';
import { Card } from '../card/card';
import { SelectedAnkemulighet } from '../selected/selected-ankemulighet';
import { Ankemulighet } from './ankemulighet';

interface Props {
  ankemuligheter: IBehandling[];
}

export const Ankemuligheter = ({ ankemuligheter }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) {
    return <SelectedAnkemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <Card>
      <Header>
        <Heading level="1" size="small">
          Ankemuligheter
        </Heading>

        <StyledButton
          size="small"
          variant="tertiary-neutral"
          title="Vis kun valgt ankemulighet"
          onClick={() => setIsExpanded(false)}
          icon={<Collapse aria-hidden />}
        />
      </Header>
      <TableContainer $showShadow={ankemuligheter.length >= 3}>
        <Table zebraStripes size="small">
          <StyledTableHeader>
            <Table.Row>
              <Table.HeaderCell>Ytelse</Table.HeaderCell>
              <Table.HeaderCell>Vedtaksdato</Table.HeaderCell>
              <Table.HeaderCell>Saken gjelder</Table.HeaderCell>
              <Table.HeaderCell>Klager</Table.HeaderCell>
              <Table.HeaderCell>Utfall</Table.HeaderCell>
              <Table.HeaderCell>Fullmektig</Table.HeaderCell>
              <Table.HeaderCell>Fagsak-ID</Table.HeaderCell>
              <Table.HeaderCell>Fagsystem</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </StyledTableHeader>
          <Table.Body>
            {ankemuligheter.map((m) => (
              <Ankemulighet key={m.behandlingId} ankemulighet={m} />
            ))}
          </Table.Body>
        </Table>
      </TableContainer>
    </Card>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TableContainer = styled.div<{ $showShadow: boolean }>`
  overflow-y: auto;
  max-height: 200px;

  ::after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    display: ${({ $showShadow }) => ($showShadow ? 'block' : 'none')};
    height: 15px;
    width: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0), #fff);
  }
`;

const StyledTableHeader = styled(Table.Header)`
  position: sticky;
  top: 0;
  background: #fff;
  box-shadow: 0 5px 5px -5px #000;
  z-index: 1;
`;

const StyledButton = styled(Button)`
  justify-self: flex-end;
  flex-grow: 0;
  width: fit-content;
  align-self: flex-end;
`;

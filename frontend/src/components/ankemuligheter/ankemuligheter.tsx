import { ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Loader, Table } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnkeContext } from '../../pages/create/anke-context';
import { useAnkemuligheter } from '../../simple-api-state/use-api';
import { IBehandling } from '../../types/behandling';
import { Card } from '../card/card';
import { Placeholder } from '../placeholder/placeholder';
import { SelectedAnkemulighet } from '../selected/selected-ankemulighet';
import { Ankemulighet } from './ankemulighet';

export const Ankemuligheter = () => {
  const { setAnkemulighet, fnr, setKlager, ankemulighet } = useContext(AnkeContext);
  const { data: ankemuligheter, isLoading } = useAnkemuligheter(fnr);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (typeof ankemuligheter === 'undefined') {
      setIsExpanded(true);
      setAnkemulighet(null);
      setKlager(null);
    }
  }, [ankemuligheter, isLoading, setAnkemulighet, setKlager]);

  if (!isExpanded && ankemulighet !== null) {
    return <SelectedAnkemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <Card>
      <Header>
        <Heading level="1" size="small">
          Velg vedtaket anken gjelder
        </Heading>

        {ankemulighet === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            title="Vis kun valgt ankemulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </Header>
      <Content ankemuligheter={ankemuligheter} isLoading={isLoading} />
    </Card>
  );
};

interface ContentProps {
  ankemuligheter: IBehandling[] | undefined;
  isLoading: boolean;
}

const Content = ({ ankemuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <Placeholder>
        <Loader size="3xlarge" title="Laster..." />
      </Placeholder>
    );
  }

  if (ankemuligheter === undefined) {
    return (
      <Placeholder>
        <ParagraphIcon aria-hidden />
      </Placeholder>
    );
  }

  if (ankemuligheter.length === 0) {
    return <BodyShort>Ingen ankemuligheter</BodyShort>;
  }

  return (
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

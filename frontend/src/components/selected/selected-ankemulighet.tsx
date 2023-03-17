import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, Label, Tag } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { isoDateTimeToPrettyDate } from '../../domain/date';
import { getSakspartName } from '../../domain/name';
import { useUtfallName, useYtelseName } from '../../hooks/kodeverk';
import { AnkeContext } from '../../pages/create/anke-context';
import { IBehandling } from '../../types/behandling';
import { Card } from '../card/card';

interface Props {
  onClick: () => void;
}

export const SelectedAnkemulighet = ({ onClick }: Props) => {
  const { ankemulighet } = useContext(AnkeContext);

  if (ankemulighet === null) {
    return null;
  }

  return <RenderAnkemulighet ankemulighet={ankemulighet} onClick={onClick} />;
};

interface RenderProps extends Props {
  ankemulighet: IBehandling;
}

const RenderAnkemulighet = ({ ankemulighet, onClick }: RenderProps) => {
  const { ytelseId, vedtakDate, sakenGjelder, klager, utfallId, fullmektig, sakFagsakId, sakFagsystem } = ankemulighet;

  const utfallName = useUtfallName(utfallId);
  const ytelseName = useYtelseName(ytelseId);

  return (
    <Card>
      <Header>
        <Heading size="small" level="1">
          Valgt vedtak
        </Heading>
        <Button
          size="small"
          title="Vis alle ankemuligheter"
          onClick={onClick}
          icon={<ChevronDownIcon aria-hidden />}
          variant="tertiary-neutral"
        />
      </Header>
      <Ankemulighet>
        <Column>
          <Label size="small">Ytelse</Label>
          <Tag size="small" variant="alt3">
            {ytelseName}
          </Tag>
        </Column>
        <Column>
          <Label size="small">Dato</Label>
          <Detail as="time" dateTime={vedtakDate}>
            {isoDateTimeToPrettyDate(vedtakDate) ?? ''}
          </Detail>
        </Column>
        <Column>
          <Label size="small">Saken gjelder</Label>
          <Detail>{getSakspartName(sakenGjelder)}</Detail>
        </Column>
        <Column>
          <Label size="small">Klager</Label>
          <Detail>{getSakspartName(klager)}</Detail>
        </Column>
        <Column>
          <Label size="small">Utfall</Label>
          <Tag size="small" variant="alt1">
            {utfallName}
          </Tag>
        </Column>
        <Column>
          <Label size="small">Fullmektig</Label>
          <Detail>{getSakspartName(fullmektig)}</Detail>
        </Column>
        <Column>
          <Label size="small">Fagsak-ID</Label>
          <Detail>{sakFagsakId}</Detail>
        </Column>
        <Column>
          <Label size="small">Fagsystem</Label>
          <Detail>{sakFagsystem}</Detail>
        </Column>
      </Ankemulighet>
    </Card>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Ankemulighet = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: 16px;
  background-color: var(--a-blue-50);
  border: 1px solid var(--a-blue-200);
  padding: 16px;
  border-radius: 4px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, Label, Tag } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { getSakspartName } from '@app/domain/name';
import { useFagsystemName, useUtfallName, useYtelseName } from '@app/hooks/kodeverk';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IAnkeMulighet } from '@app/types/mulighet';

interface Props {
  onClick: () => void;
}

export const SelectedAnkemulighet = ({ onClick }: Props) => {
  const { type, payload } = useContext(ApiContext);

  if (type !== Type.ANKE || payload.mulighet === null) {
    return null;
  }

  return <RenderAnkemulighet mulighet={payload.mulighet} onClick={onClick} />;
};

interface RenderProps extends Props {
  mulighet: IAnkeMulighet;
}

const RenderAnkemulighet = ({ mulighet, onClick }: RenderProps) => {
  const { ytelseId, vedtakDate, sakenGjelder, klager, utfallId, fullmektig, fagsakId, fagsystemId } = mulighet;

  const utfallName = useUtfallName(utfallId);
  const ytelseName = useYtelseName(ytelseId);
  const fagsystemName = useFagsystemName(fagsystemId);

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
          <StyledLabel size="small">Ytelse</StyledLabel>
          <Tag size="small" variant="alt3">
            {ytelseName}
          </Tag>
        </Column>
        <Column>
          <StyledLabel size="small">Dato</StyledLabel>
          {vedtakDate === null ? (
            'Ukjent'
          ) : (
            <Detail as="time" dateTime={vedtakDate}>
              {isoDateTimeToPrettyDate(vedtakDate) ?? vedtakDate}
            </Detail>
          )}
        </Column>
        <Column>
          <StyledLabel size="small">Saken gjelder</StyledLabel>
          <Detail>{getSakspartName(sakenGjelder)}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Klager</StyledLabel>
          <Detail>{getSakspartName(klager)}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Utfall</StyledLabel>
          <Tag size="small" variant="alt1">
            {utfallName}
          </Tag>
        </Column>
        <Column>
          <StyledLabel size="small">Fullmektig</StyledLabel>
          <Detail>{getSakspartName(fullmektig)}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Fagsak-ID</StyledLabel>
          <Detail>{fagsakId}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Fagsystem</StyledLabel>
          <Detail>{fagsystemName}</Detail>
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
  row-gap: 8px;
`;

const StyledLabel = styled(Label)`
  white-space: nowrap;
`;

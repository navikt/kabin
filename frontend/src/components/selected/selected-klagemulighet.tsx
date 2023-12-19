import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, Label, Tag } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId, useVedtaksenhetName } from '@app/hooks/kodeverk';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IKlagemulighet } from '@app/types/mulighet';

interface Props {
  onClick: () => void;
}

export const SelectedKlagemulighet = ({ onClick }: Props) => {
  const { type, payload } = useContext(ApiContext);

  if (type !== Type.KLAGE || payload.mulighet === null) {
    return null;
  }

  return <RenderKlagemulighet mulighet={payload.mulighet} onClick={onClick} />;
};

interface RenderProps extends Props {
  mulighet: IKlagemulighet;
}

const RenderKlagemulighet = ({ mulighet, onClick }: RenderProps) => {
  const { behandlingId, temaId, vedtakDate, fagsakId, fagsystemId, klageBehandlendeEnhet } = mulighet;

  const temaName = useFullTemaNameFromId(temaId);
  const vedtaksenhetName = useVedtaksenhetName(klageBehandlendeEnhet);
  const fagsystemName = useFagsystemName(fagsystemId);

  return (
    <Card>
      <Header>
        <Heading size="small" level="1">
          Valgt klagemulighet
        </Heading>
        <Button
          size="small"
          title="Vis alle klagemuligheter"
          onClick={onClick}
          icon={<ChevronDownIcon aria-hidden />}
          variant="tertiary-neutral"
        />
      </Header>
      <Klagemulighet>
        <Column>
          <StyledLabel size="small">Saks-Id</StyledLabel>
          <Detail>{behandlingId}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Tema</StyledLabel>
          <Tag size="small" variant="alt3">
            {temaName}
          </Tag>
        </Column>
        <Column>
          <StyledLabel size="small">Dato</StyledLabel>
          <Detail as="time" dateTime={vedtakDate}>
            {isoDateToPretty(vedtakDate) ?? vedtakDate}
          </Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Behandlende enhet</StyledLabel>
          <Detail>{vedtaksenhetName}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Fagsak-ID</StyledLabel>
          <Detail>{fagsakId}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Fagsystem</StyledLabel>
          <Detail>{fagsystemName}</Detail>
        </Column>
      </Klagemulighet>
    </Card>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Klagemulighet = styled.div`
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

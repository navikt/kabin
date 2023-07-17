import { ArrowsCirclepathIcon, ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Loader, Table } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { CardSmall } from '@app/components/card/card';
import { StyledTableHeader, TableContainer } from '@app/components/muligheter/common/styled-components';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedKlagemulighet } from '@app/components/selected/selected-klagemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useKlagemuligheter } from '@app/simple-api-state/use-api';
import { IKlagemulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { Klagemulighet } from './klagemulighet';

export const Klagemuligheter = () => {
  const { type, payload, updatePayload, fnr } = useContext(ApiContext);

  const { data: klagemuligheter, isLoading, refetch } = useKlagemuligheter(fnr);
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  useEffect(() => {
    if (typeof klagemuligheter === 'undefined' && type === Type.KLAGE) {
      setIsExpanded(true);

      if (payload.mulighet !== null) {
        updatePayload({ mulighet: null });
      }
    }
  }, [klagemuligheter, isLoading, type, updatePayload, payload?.mulighet]);

  if (type !== Type.KLAGE) {
    return null;
  }

  if (!isExpanded && payload.mulighet !== null) {
    return <SelectedKlagemulighet onClick={() => setIsExpanded(true)} />;
  }

  const onRefresh = async () => {
    const updated = await refetch();

    if (updated === undefined) {
      return;
    }

    const { mulighet } = payload;

    if (mulighet === null) {
      return;
    }

    updatePayload({ mulighet: updated.find((a) => a.behandlingId === mulighet.behandlingId) ?? null });
  };

  return (
    <CardSmall>
      <Header>
        <Heading level="1" size="small">
          Velg vedtaket klagen gjelder
        </Heading>

        <Button
          size="xsmall"
          variant="tertiary"
          onClick={onRefresh}
          loading={isLoading}
          icon={<ArrowsCirclepathIcon aria-hidden />}
          title="Oppdater"
        />

        {payload.mulighet === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            title="Vis kun valgt klagemulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </Header>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Content klagemuligheter={klagemuligheter} isLoading={isLoading} />
    </CardSmall>
  );
};

const Header = styled.div`
  display: grid;
  grid-template-columns: min-content min-content 1fr;
  grid-gap: 4px;
  white-space: nowrap;
`;

const StyledButton = styled(Button)`
  flex-grow: 0;
  width: fit-content;
  align-self: flex-end;
  justify-self: right;
`;

interface ContentProps {
  klagemuligheter: IKlagemulighet[] | undefined;
  isLoading: boolean;
}

const Content = ({ klagemuligheter, isLoading }: ContentProps) => {
  if (isLoading) {
    return (
      <Placeholder>
        <Loader size="3xlarge" title="Laster..." />
      </Placeholder>
    );
  }

  if (klagemuligheter === undefined) {
    return (
      <Placeholder>
        <ParagraphIcon aria-hidden />
      </Placeholder>
    );
  }

  if (klagemuligheter.length === 0) {
    return <BodyShort>Ingen klagemuligheter</BodyShort>;
  }

  return (
    <TableContainer $showShadow={klagemuligheter.length >= 3}>
      <Table zebraStripes size="small">
        <StyledTableHeader>
          <Table.Row>
            <Table.HeaderCell>Saks-ID</Table.HeaderCell>
            <Table.HeaderCell>Tema</Table.HeaderCell>
            <Table.HeaderCell>Vedtak/innstilling</Table.HeaderCell>
            <Table.HeaderCell>Behandlende enhet</Table.HeaderCell>
            <Table.HeaderCell>Fagsak-ID</Table.HeaderCell>
            <Table.HeaderCell>Fagsystem</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </StyledTableHeader>
        <Table.Body>
          {klagemuligheter.map((klagemulighet) => (
            <Klagemulighet key={klagemulighet.behandlingId} mulighet={klagemulighet} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};

import { ArrowsCirclepathIcon, ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Loader, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { CardSmall } from '@app/components/card/card';
import { StyledTableHeader, TableContainer } from '@app/components/muligheter/common/styled-components';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedAnkemulighet } from '@app/components/selected/selected-ankemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useAnkemuligheter } from '@app/simple-api-state/use-api';
import { SaksTypeEnum } from '@app/types/common';
import { IAnkemulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { Warning } from '../common/warning';
import { Ankemulighet } from './ankemulighet';

export const Ankemuligheter = () => {
  const { sakenGjelderValue } = useRegistrering();
  const { typeId, mulighet } = useMulighet();
  const { data: journalpost } = useJournalpost();
  const { data: ankemuligheter, isLoading, refetch } = useAnkemuligheter(sakenGjelderValue ?? skipToken);
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.BEHANDLING_ID);

  if (typeId !== SaksTypeEnum.ANKE) {
    return null;
  }

  if (!isExpanded && mulighet !== null) {
    return <SelectedAnkemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardSmall>
      <Header>
        <Heading level="1" size="small">
          Velg vedtaket anken gjelder
        </Heading>

        <Button
          size="xsmall"
          variant="tertiary"
          onClick={refetch}
          loading={isLoading}
          icon={<ArrowsCirclepathIcon aria-hidden />}
          title="Oppdater"
        />

        {mulighet === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            title="Vis kun valgt ankemulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </Header>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.BEHANDLING_ID} />

      <Warning datoOpprettet={journalpost?.datoOpprettet} vedtakDate={mulighet?.vedtakDate} />

      <Content ankemuligheter={ankemuligheter} isLoading={isLoading} />
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
  ankemuligheter: IAnkemulighet[] | undefined;
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
      <Table zebraStripes size="small" id={ValidationFieldNames.MULIGHET} aria-label="Ankemuligheter">
        <StyledTableHeader>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Fagsak-ID</Table.HeaderCell>
            <Table.HeaderCell>Tema</Table.HeaderCell>
            <Table.HeaderCell>Ytelse</Table.HeaderCell>
            <Table.HeaderCell>Vedtaksdato</Table.HeaderCell>
            <Table.HeaderCell>Fagsystem</Table.HeaderCell>
            <Table.HeaderCell />
            <Table.HeaderCell />
          </Table.Row>
        </StyledTableHeader>
        <Table.Body>
          {ankemuligheter.map((ankemulighet) => (
            <Ankemulighet key={ankemulighet.id} ankemulighet={ankemulighet} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};

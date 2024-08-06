import { ArrowsCirclepathIcon, ChevronUpIcon, ParagraphIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Loader, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { Card, CardSmall } from '@app/components/card/card';
import { StyledTableHeader, TableContainer } from '@app/components/muligheter/common/styled-components';
import { Placeholder } from '@app/components/placeholder/placeholder';
import { SelectedKlagemulighet } from '@app/components/selected/selected-klagemulighet';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useGetKlagemuligheterQuery, useGetRegistreringKlagemulighetQuery } from '@app/redux/api/muligheter';
import { SaksTypeEnum } from '@app/types/common';
import { IKlagemulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';
import { Klagemulighet } from './klagemulighet';

export const Klagemuligheter = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableKlagemuligheter />;
  }

  return <ReadOnlyKlagemulighet />;
};

const ReadOnlyKlagemulighet = () => {
  const id = useRegistreringId();
  const { data, isLoading } = useGetRegistreringKlagemulighetQuery(id);

  return (
    <Card>
      <Header>
        <Heading level="1" size="small">
          Vedtaket klagen gjelder
        </Heading>
      </Header>

      <Content klagemuligheter={data === undefined ? undefined : [data]} isLoading={isLoading} />
    </Card>
  );
};

const EditableKlagemuligheter = () => {
  const { sakenGjelderValue, typeId, mulighet } = useRegistrering();
  const {
    data: klagemuligheter,
    isLoading,
    isFetching,
    refetch,
  } = useGetKlagemuligheterQuery(sakenGjelderValue ?? skipToken);
  const [isExpanded, setIsExpanded] = useState(true);
  const error = useValidationError(ValidationFieldNames.VEDTAK);

  if (typeId !== SaksTypeEnum.KLAGE) {
    return null;
  }

  if (!isExpanded && mulighet !== null) {
    return <SelectedKlagemulighet onClick={() => setIsExpanded(true)} />;
  }

  return (
    <CardSmall>
      <Header>
        <Heading level="1" size="small">
          Velg vedtaket klagen gjelder
        </Heading>

        <Button
          size="xsmall"
          variant="tertiary"
          onClick={refetch}
          loading={isFetching}
          icon={<ArrowsCirclepathIcon aria-hidden />}
          title="Oppdater"
        />

        {mulighet === null ? null : (
          <StyledButton
            size="small"
            variant="tertiary-neutral"
            title="Vis kun valgt klagemulighet"
            onClick={() => setIsExpanded(false)}
            icon={<ChevronUpIcon aria-hidden />}
          />
        )}
      </Header>

      <ValidationErrorMessage error={error} id={ValidationFieldNames.VEDTAK} />

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
      <Table zebraStripes size="small" id={ValidationFieldNames.MULIGHET} aria-label="Klagemuligheter">
        <StyledTableHeader>
          <Table.Row>
            <Table.HeaderCell>Fagsak-ID</Table.HeaderCell>
            <Table.HeaderCell>Saks-ID</Table.HeaderCell>
            <Table.HeaderCell>Tema</Table.HeaderCell>
            <Table.HeaderCell>Vedtak/innstilling</Table.HeaderCell>
            <Table.HeaderCell>Behandlende enhet</Table.HeaderCell>
            <Table.HeaderCell>Fagsystem</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </StyledTableHeader>
        <Table.Body>
          {klagemuligheter.map((klagemulighet) => (
            <Klagemulighet key={klagemulighet.id} klagemulighet={klagemulighet} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};

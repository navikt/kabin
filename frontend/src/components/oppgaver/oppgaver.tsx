import { Alert, BodyLong, Heading, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { Header } from '@app/components/oppgaver/header';
import { useParams } from '@app/components/oppgaver/hooks';
import { LoadingOppgaver } from '@app/components/oppgaver/loading-oppgaver';
import { Row } from '@app/components/oppgaver/row';
import { TableHeaders } from '@app/components/oppgaver/table-headers';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useGetOppgaverQuery } from '@app/redux/api/oppgaver';
import { SaksTypeEnum } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

export const Oppgaver = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return <EditableOppgaver />;
  }

  return <ReadOnlyOppgaver />;
};

const ReadOnlyOppgaver = () => {
  const { overstyringer } = useRegistrering();
  const { oppgaveId } = overstyringer;
  const oppgaverParams = useParams();
  const { oppgave, isLoading } = useGetOppgaverQuery(oppgaveId === null ? skipToken : oppgaverParams, {
    selectFromResult: ({ data, ...rest }) => ({ oppgave: data?.find((o) => o.id === oppgaveId), ...rest }),
  });

  if (oppgaveId === null) {
    return (
      <Card>
        <Heading level="2" size="small">
          Gosys-oppgave
        </Heading>

        <Alert variant="info" size="small" inline>
          Ingen Gosys-oppgave valgt
        </Alert>
      </Card>
    );
  }

  if (isLoading || oppgave === undefined) {
    return <LoadingOppgaver header={<Header />} tableHeaders={<TableHeaders />} />;
  }

  return (
    <Card>
      <Heading level="2" size="small">
        Gosys-oppgave
      </Heading>

      <Table size="small" zebraStripes aria-label="Gosys-oppgaver">
        <TableHeaders />
        <Table.Body>
          <Row {...oppgave} />
        </Table.Body>
      </Table>
    </Card>
  );
};

const EditableOppgaver = () => {
  const oppgaverParams = useParams();
  const { data: oppgaver, isLoading } = useGetOppgaverQuery(oppgaverParams);
  const error = useValidationError(ValidationFieldNames.OPPGAVE);

  if (oppgaverParams === skipToken) {
    return null;
  }

  if (isLoading) {
    return <LoadingOppgaver header={<Header />} tableHeaders={<TableHeaders />} />;
  }

  if (oppgaver === undefined || oppgaver.length === 0) {
    return (
      <Card>
        <Header />
        <ErrorMessage />
      </Card>
    );
  }

  return (
    <Card>
      <Header />

      <ValidationErrorMessage error={error} id={ValidationFieldNames.OPPGAVE} />

      <Table size="small" zebraStripes aria-label="Gosys-oppgaver">
        <TableHeaders />
        <Table.Body>
          {oppgaver.map((oppgave) => (
            <Row key={oppgave.id} {...oppgave} />
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
};

const StyledAlert = styled(Alert)`
  & .navds-alert__wrapper {
    max-width: none;
    gap: 1rem;
    display: flex;
    flex-direction: column;
  }
`;

const Contact = () => (
  <BodyLong>
    Ta kontakt med Team Klage i <i>Merkantil og Team Klage</i> på Teams dersom oppgaven allerede er opprettet uten å
    dukke opp her.
  </BodyLong>
);

const ErrorMessage = () => {
  const { typeId } = useRegistrering();

  if (typeId === SaksTypeEnum.KLAGE) {
    return (
      <StyledAlert variant="warning" size="small">
        <BodyLong>
          Ingen Gosys-oppgaver funnet. Klagesaken har ikke en oppgave i Gosys, og du må derfor opprette en. Kabal bruker
          denne oppgaven til å gi beskjed til vedtaksinstans når klagebehandling er fullført.
        </BodyLong>
        <Contact />
      </StyledAlert>
    );
  }

  if (typeId === SaksTypeEnum.ANKE) {
    return (
      <StyledAlert variant="warning" size="small">
        <BodyLong>
          Ingen Gosys-oppgaver funnet. Ankesaken har ikke en oppgave i Gosys, og du må derfor opprette en. Kabal bruker
          denne oppgaven til å gi beskjed til vedtaksinstans når ankebehandling er fullført.
        </BodyLong>
        <Contact />
      </StyledAlert>
    );
  }

  return null;
};

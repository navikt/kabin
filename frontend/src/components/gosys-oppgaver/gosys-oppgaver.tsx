import { Card } from '@app/components/card/card';
import { Header } from '@app/components/gosys-oppgaver/header';
import { useIsEnabled, useParams } from '@app/components/gosys-oppgaver/hooks';
import { LoadingGosysOppgaver } from '@app/components/gosys-oppgaver/loading-gosys-oppgaver';
import { Row } from '@app/components/gosys-oppgaver/row';
import { TableHeaders } from '@app/components/gosys-oppgaver/table-headers';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useGetGosysOppgaverQuery } from '@app/redux/api/oppgaver';
import { SaksTypeEnum } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';
import { Alert, BodyLong, Heading, InfoCard, Table, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

export const GosysOppgaver = () => {
  const canEdit = useCanEdit();
  const isEnabled = useIsEnabled();

  if (!isEnabled) {
    return null;
  }

  if (canEdit) {
    return <EditableGosysOppgaver />;
  }

  return <ReadOnlyGosysOppgaver />;
};

const ReadOnlyGosysOppgaver = () => {
  const { overstyringer } = useRegistrering();
  const { gosysOppgaveId: oppgaveId } = overstyringer;
  const params = useParams();
  const { gosysOppgave, isLoading } = useGetGosysOppgaverQuery(oppgaveId === null ? skipToken : params, {
    selectFromResult: ({ data, ...rest }) => ({ gosysOppgave: data?.find((o) => o.id === oppgaveId), ...rest }),
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

  if (isLoading || gosysOppgave === undefined) {
    return <LoadingGosysOppgaver header={<Header />} tableHeaders={<TableHeaders />} />;
  }

  return (
    <Card>
      <Heading level="2" size="small">
        Gosys-oppgave
      </Heading>

      <Table size="small" zebraStripes aria-label="Gosys-oppgaver">
        <TableHeaders />
        <Table.Body>
          <Row {...gosysOppgave} />
        </Table.Body>
      </Table>
    </Card>
  );
};

const EditableGosysOppgaver = () => {
  const params = useParams();
  const { data: gosysOppgaver, isLoading } = useGetGosysOppgaverQuery(params);
  const error = useValidationError(ValidationFieldNames.GOSYS_OPPGAVE);

  if (params === skipToken) {
    return null;
  }

  if (isLoading) {
    return <LoadingGosysOppgaver header={<Header />} tableHeaders={<TableHeaders />} />;
  }

  if (gosysOppgaver === undefined || gosysOppgaver.length === 0) {
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

      <ValidationErrorMessage error={error} id={ValidationFieldNames.GOSYS_OPPGAVE} />

      <Table size="small" zebraStripes aria-label="Gosys-oppgaver">
        <TableHeaders />
        <Table.Body>
          {gosysOppgaver.map((gosysOppgave) => (
            <Row key={gosysOppgave.id} {...gosysOppgave} />
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
};

const ErrorMessage = () => {
  const { typeId } = useRegistrering();

  if (typeId === SaksTypeEnum.KLAGE) {
    return (
      <WarningCard>
        Klagesaken har ikke en oppgave i Gosys, og du må derfor opprette en. Kabal bruker denne oppgaven til å gi
        beskjed til vedtaksinstans når klagebehandling er fullført.
      </WarningCard>
    );
  }

  if (typeId === SaksTypeEnum.ANKE) {
    return (
      <WarningCard>
        Ankesaken har ikke en oppgave i Gosys, og du må derfor opprette en. Kabal bruker denne oppgaven til å gi beskjed
        til vedtaksinstans når ankebehandling er fullført.
      </WarningCard>
    );
  }

  if (typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return (
      <WarningCard>
        Omgjøringskravet har ikke en oppgave i Gosys, og du må derfor opprette en. Kabal bruker denne oppgaven til å gi
        beskjed til vedtaksinstans når omgjøringskravet er behandlet.
      </WarningCard>
    );
  }

  return null;
};

const Contact = () => (
  <BodyLong>
    Ta kontakt med Team Klage i{' '}
    <Tag variant="outline" size="small">
      Merkantil og Team Klage
    </Tag>{' '}
    på Teams dersom oppgaven allerede er opprettet uten å dukke opp her.
  </BodyLong>
);

interface CardProps {
  children: string;
}

const WarningCard = ({ children }: CardProps) => (
  <InfoCard data-color="warning" size="small">
    <InfoCard.Header>
      <InfoCard.Title>Ingen Gosys-oppgaver funnet</InfoCard.Title>
    </InfoCard.Header>

    <InfoCard.Content>
      <BodyLong spacing>{children}</BodyLong>

      <Contact />
    </InfoCard.Content>
  </InfoCard>
);

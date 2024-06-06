import { Alert, BodyLong, Table } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useValidationError } from '@app/hooks/use-validation-error';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { useGetOppgaver } from '@app/simple-api-state/use-api';
import { ValidationFieldNames } from '@app/types/validation';
import { Header } from './header';
import { oppgaverIsEnabled, useParams } from './hooks';
import { Row } from './row';
import { SkeletonTable } from './skeleton-table';
import { TableHeaders } from './table-headers';

export const Oppgaver = () => {
  const { fnr, type, state } = useContext(AppContext);
  const { data: oppgaver, isLoading } = useGetOppgaver(useParams(type, fnr, state));
  const error = useValidationError(ValidationFieldNames.OPPGAVE);

  if (!oppgaverIsEnabled(type, state)) {
    return null;
  }

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (oppgaver === undefined || oppgaver.length === 0) {
    return (
      <Card>
        <Header />
        <ErrorMessage type={type} />
      </Card>
    );
  }

  return (
    <Card>
      <Header />
      <ValidationErrorMessage error={error} />
      <Table size="small" zebraStripes>
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

const ErrorMessage = ({ type }: { type: Type }) => {
  if (type === Type.KLAGE) {
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

  if (type === Type.ANKE) {
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

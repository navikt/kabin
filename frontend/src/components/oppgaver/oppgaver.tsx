import { Alert, BodyLong, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useGetOppgaverQuery } from '@app/redux/api/oppgaver';
import { SaksTypeEnum } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';
import { Header } from './header';
import { useParams } from './hooks';
import { Row } from './row';
import { SkeletonTable } from './skeleton-table';
import { TableHeaders } from './table-headers';

export const Oppgaver = () => {
  const oppgaverParams = useParams();
  const { data: oppgaver, isLoading } = useGetOppgaverQuery(oppgaverParams);
  const error = useValidationError(ValidationFieldNames.OPPGAVE);

  if (oppgaverParams === skipToken) {
    return null;
  }

  if (isLoading) {
    return <SkeletonTable />;
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

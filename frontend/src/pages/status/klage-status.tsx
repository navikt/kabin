import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { StatusHeading } from '@app/pages/status/common-components';
import { StatusDetails } from '@app/pages/status/details';
import { DataContainer, LoadingContainer, StyledLoader } from '@app/pages/status/styled-components';
import { FinishedRegistrering, FinishingRegistrering } from '@app/redux/api/registreringer/types';
import { useGetKlageStatusQuery } from '@app/redux/api/status';
import { IKlagestatus } from '@app/types/status';

interface Props {
  registrering: FinishedRegistrering | FinishingRegistrering;
}

export const KlageStatusPage = ({ registrering }: Props) => {
  const { id, typeId, behandlingId, finished } = registrering;
  const { data, isLoading, isError } = useGetKlageStatusQuery(behandlingId ?? skipToken);
  const Container = isLoading || data === undefined ? LoadingContainer : DataContainer;

  return (
    <StyledMain>
      <StatusHeading
        alertText={`Klagen ble registrert og klar for saksbehandling i Kabal ${isoDateTimeToPretty(finished)}.`}
        headingText="Klage opprettet"
        type={typeId}
        behandlingId={behandlingId}
      />
      <Container>
        <KlageDetailsLoader isLoading={isLoading} data={data} id={id} isError={isError} />
      </Container>
    </StyledMain>
  );
};

const StyledMain = styled.main`
  padding-top: 16px;
`;

interface KlageDetailsLoaderProps {
  data: IKlagestatus | undefined;
  id: string | undefined;
  isLoading: boolean;
  isError: boolean;
}

const KlageDetailsLoader = ({ isLoading, isError, data, id }: KlageDetailsLoaderProps) => {
  if (isError) {
    return <Alert variant="error">Kunne ikke hente status</Alert>;
  }

  if (isLoading || data === undefined || id === undefined) {
    return <StyledLoader size="3xlarge" title="Laster behandling..." />;
  }

  return <StatusDetails id={id} status={data} />;
};

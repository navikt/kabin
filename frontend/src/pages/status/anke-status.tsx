import { isoDateTimeToPretty } from '@app/domain/date';
import { StatusDetails } from '@app/pages/status/details';
import { StatusHeading } from '@app/pages/status/heading';
import { DataContainer, LoadingContainer, StyledLoader } from '@app/pages/status/styled-components';
import type { FinishedRegistrering } from '@app/redux/api/registreringer/types';
import { useGetAnkeStatusQuery } from '@app/redux/api/status';
import type { IAnkestatus } from '@app/types/status';
import { Alert } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  registrering: FinishedRegistrering;
}

export const AnkeStatusPage = ({ registrering }: Props) => {
  const { id, typeId, behandlingId, finished } = registrering;
  const { data, isLoading, isError } = useGetAnkeStatusQuery(behandlingId);
  const Container = isLoading || data === undefined ? LoadingContainer : DataContainer;

  return (
    <StyledMain>
      <StatusHeading
        alertText={`Anken ble registrert og klar for saksbehandling i Kabal ${isoDateTimeToPretty(finished)}.`}
        headingText="Anke opprettet"
        type={typeId}
        behandlingId={behandlingId}
        registreringId={id}
      />
      <Container>
        <AnkeDetailsLoader data={data} isLoading={isLoading} id={id} isError={isError} />
      </Container>
    </StyledMain>
  );
};

const StyledMain = styled.main`
  padding-top: 16px;
`;

interface AnkeDetailsLoaderProps {
  data: IAnkestatus | undefined;
  id: string | undefined;
  isLoading: boolean;
  isError: boolean;
}

const AnkeDetailsLoader = ({ isLoading, isError, data, id }: AnkeDetailsLoaderProps) => {
  if (isError) {
    return <Alert variant="error">Kunne ikke hente status</Alert>;
  }

  if (isLoading || data === undefined || id === undefined) {
    return <StyledLoader size="3xlarge" title="Laster behandling..." />;
  }

  return <StatusDetails id={id} status={data} />;
};

import { isoDateTimeToPretty } from '@app/domain/date';
import { StatusDetails } from '@app/pages/status/details';
import { StatusHeading } from '@app/pages/status/heading';
import { DataContainer, LoadingContainer, StyledLoader } from '@app/pages/status/styled-components';
import type { FinishedRegistrering } from '@app/redux/api/registreringer/types';
import { useGetKlageStatusQuery } from '@app/redux/api/status';
import type { IKlagestatus } from '@app/types/status';
import { Alert } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  registrering: FinishedRegistrering;
}

export const KlageStatusPage = ({ registrering }: Props) => {
  const { id, typeId, behandlingId, finished } = registrering;
  const { data, isLoading, isError } = useGetKlageStatusQuery(behandlingId);
  const Container = isLoading || data === undefined ? LoadingContainer : DataContainer;

  return (
    <StyledMain>
      <StatusHeading
        alertText={`Klagen ble registrert og klar for saksbehandling i Kabal ${isoDateTimeToPretty(finished)}.`}
        headingText="Klage opprettet"
        type={typeId}
        behandlingId={behandlingId}
        registreringId={id}
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

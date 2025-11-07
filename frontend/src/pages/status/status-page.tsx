import { StatusDetails } from '@app/pages/status/details';
import { StatusHeading } from '@app/pages/status/heading';
import { DataContainer, LoadingContainer, StyledLoader } from '@app/pages/status/styled-components';
import type { FinishedRegistrering } from '@app/redux/api/registreringer/types';
import { useGetStatusQuery } from '@app/redux/api/status';
import type { IAnkestatus, IBegjæringOmGjenopptakStatus, IKlagestatus, IOmgjøringskravstatus } from '@app/types/status';
import { Alert } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  registrering: FinishedRegistrering;
  alertText: string;
  headingText: string;
}

export const Status = ({ registrering, alertText, headingText }: Props) => {
  const { id, typeId, behandlingId } = registrering;
  const { data, isLoading, isError } = useGetStatusQuery(behandlingId);
  const Container = isLoading || data === undefined ? LoadingContainer : DataContainer;

  return (
    <StyledMain>
      <StatusHeading
        alertText={alertText}
        headingText={headingText}
        type={typeId}
        behandlingId={behandlingId}
        registreringId={id}
      />
      <Container>
        <DetailsLoader data={data} isLoading={isLoading} id={id} isError={isError} />
      </Container>
    </StyledMain>
  );
};

const StyledMain = styled.main`
  padding-top: 16px;
`;

interface DetailsLoaderProps {
  data: IAnkestatus | IKlagestatus | IOmgjøringskravstatus | IBegjæringOmGjenopptakStatus | undefined;
  id: string | undefined;
  isLoading: boolean;
  isError: boolean;
}

const DetailsLoader = ({ isLoading, isError, data, id }: DetailsLoaderProps) => {
  if (isError) {
    return <Alert variant="error">Kunne ikke hente status</Alert>;
  }

  if (isLoading || data === undefined || id === undefined) {
    return <StyledLoader size="3xlarge" title="Laster behandling..." />;
  }

  return <StatusDetails id={id} status={data} />;
};

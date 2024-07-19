import { useParams } from 'react-router-dom';
import { StatusHeading } from '@app/pages/status/common-components';
import { StatusDetails } from '@app/pages/status/details';
import { DataContainer, LoadingContainer, PageWrapper, StyledLoader } from '@app/pages/status/styled-components';
import { useAnkeStatus } from '@app/simple-api-state/use-api';
import { SaksTypeEnum, skipToken } from '@app/types/common';
import { IAnkestatus } from '@app/types/status';

interface AnkeStatusProps {
  type: SaksTypeEnum.ANKE;
}

export const AnkeStatusPage = ({ type }: AnkeStatusProps) => {
  const { id } = useParams();
  const { data, isLoading } = useAnkeStatus(id === undefined ? skipToken : { id, type });
  const Container = isLoading || data === undefined ? LoadingContainer : DataContainer;

  return (
    <PageWrapper>
      <Container>
        <StatusHeading
          alertText="Anken er nå registrert og klar for saksbehandling i Kabal"
          headingText="Anke opprettet"
          type={type}
          behandlingId={id}
        />
        <AnkeDetailsLoader loading={isLoading} data={data} id={id} />
      </Container>
    </PageWrapper>
  );
};

interface AnkeDetailsLoaderProps {
  data: IAnkestatus | undefined;
  id: string | undefined;
  loading: boolean;
}

const AnkeDetailsLoader = ({ loading, data, id }: AnkeDetailsLoaderProps) => {
  if (loading || data === undefined || id === undefined) {
    return <StyledLoader size="3xlarge" title="Laster..." />;
  }

  return <StatusDetails id={id} status={data} />;
};

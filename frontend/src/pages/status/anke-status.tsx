import React from 'react';
import { useParams } from 'react-router-dom';
import { AnkeDetails } from '@app/pages/status/anke-details';
import { StatusHeading } from '@app/pages/status/common-components';
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
  const Container = isLoading || typeof data === 'undefined' ? LoadingContainer : DataContainer;

  return (
    <PageWrapper>
      <Container>
        <StatusHeading
          alertText="Anken er nå registrert og klar for saksbehandling i Kabal"
          headingText="Anke opprettet"
        />
        <AnkeDetailsLoader loading={isLoading} data={data} />
      </Container>
    </PageWrapper>
  );
};

interface AnkeDetailsLoaderProps {
  data: IAnkestatus | undefined;
  loading: boolean;
}

const AnkeDetailsLoader = ({ loading, data }: AnkeDetailsLoaderProps) => {
  if (loading || typeof data === 'undefined') {
    return <StyledLoader size="3xlarge" title="Laster..." />;
  }

  return <AnkeDetails {...data} />;
};

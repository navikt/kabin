import React from 'react';
import { useParams } from 'react-router-dom';
import { StatusHeading } from '@app/pages/status/common-components';
import { KlageDetails } from '@app/pages/status/klage-details';
import { DataContainer, LoadingContainer, PageWrapper, StyledLoader } from '@app/pages/status/styled-components';
import { useKlageStatus } from '@app/simple-api-state/use-api';
import { SaksTypeEnum, skipToken } from '@app/types/common';
import { IKlagestatus } from '@app/types/status';

interface KlageStatusProps {
  type: SaksTypeEnum.KLAGE;
}

export const KlageStatusPage = ({ type }: KlageStatusProps) => {
  const { id } = useParams();
  const { data, isLoading } = useKlageStatus(id === undefined ? skipToken : { id, type });
  const Container = isLoading || data === undefined ? LoadingContainer : DataContainer;

  return (
    <PageWrapper>
      <Container>
        <StatusHeading
          alertText="Klagen er nå registrert og klar for saksbehandling i Kabal"
          headingText="Klage opprettet"
          type={type}
          behandlingId={id}
        />
        <KlageDetailsLoader loading={isLoading} data={data} />
      </Container>
    </PageWrapper>
  );
};

interface KlageDetailsLoaderProps {
  data: IKlagestatus | undefined;
  loading: boolean;
}

const KlageDetailsLoader = ({ loading, data }: KlageDetailsLoaderProps) => {
  if (loading || data === undefined) {
    return <StyledLoader size="3xlarge" title="Laster..." />;
  }

  return <KlageDetails {...data} />;
};

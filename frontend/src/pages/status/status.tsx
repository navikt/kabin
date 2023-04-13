import { ExternalLinkIcon, HouseIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ENVIRONMENT } from '@app/environment';
import { useStatus } from '@app/simple-api-state/use-api';
import { SaksTypeEnum, skipToken } from '@app/types/common';
import { IStatus } from '@app/types/status';
import { Details } from './details';

const KABAL_URL = ENVIRONMENT.isProduction ? 'https://kabal.intern.nav.no' : 'https://kabal.intern.dev.nav.no';

interface IStatusPage {
  type: SaksTypeEnum;
}

export const StatusPage = ({ type }: IStatusPage) => {
  const { id } = useParams();

  const { data, isLoading } = useStatus(id === undefined ? skipToken : { id, type });

  const Container = isLoading || typeof data === 'undefined' ? LoadingContainer : DataContainer;

  return (
    <PageWrapper>
      <Container>
        <StyledAlert variant="success" $gridArea="title">
          <Heading level="1" size="medium">
            {getSakstype(type)} opprettet
          </Heading>
        </StyledAlert>

        <InfoPanel>
          <Alert variant="info" inline>
            Anken er nå registrert og klar for saksbehandling i Kabal.
          </Alert>
          <Buttons>
            <Button as={NavLink} to="/" variant="tertiary" icon={<HouseIcon aria-hidden />}>
              Tilbake til forsiden
            </Button>
            <Button
              as={NavLink}
              to={`${KABAL_URL}/sok`}
              variant="tertiary"
              target="_blank"
              icon={<ExternalLinkIcon title="Ekstern lenke" />}
            >
              Åpne Kabal
            </Button>
          </Buttons>
        </InfoPanel>

        <DetailsLoader loading={isLoading} data={data} />
      </Container>
    </PageWrapper>
  );
};

interface DetailsLoaderProps {
  data: IStatus | undefined;
  loading: boolean;
}

const DetailsLoader = ({ loading, data }: DetailsLoaderProps) => {
  if (loading || typeof data === 'undefined') {
    return <StyledLoader size="3xlarge" title="Laster..." />;
  }

  return <Details {...data} />;
};

const DataContainer = styled.section`
  width: 1000px;
  display: grid;
  grid-template-areas: 'title title' 'info info' 'journalpost anke' 'journalpost klage';
  grid-template-columns: 1fr 1fr;
  gap: 32px;
`;

const LoadingContainer = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const StyledLoader = styled(Loader)`
  align-self: center;
`;

const StyledAlert = styled(Alert)<{ $gridArea: string }>`
  grid-area: ${({ $gridArea }) => $gridArea};
`;

const InfoPanel = styled.div`
  display: flex;
  grid-area: info;
  align-items: center;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  background: var(--a-bg-subtle);
`;

const getSakstype = (type: SaksTypeEnum) => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return 'Anke';
    case SaksTypeEnum.KLAGE:
      return 'Klage';
  }
};

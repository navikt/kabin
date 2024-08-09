import { Skeleton } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { Card, CardMedium, CardSmall } from '@app/components/card/card';
import { LoadingDocuments } from '@app/components/documents/loading-documents';
import { LoadingKlagemuligheter } from '@app/components/muligheter/klage/loading-klagemuligheter';
import { LoadingOppgaver } from '@app/components/oppgaver/loading-oppgaver';

export const LoadingRegistrering = () => (
  <Container>
    <Left>
      <Skeleton height={40} width={300} />

      <CardMedium>
        <LoadingDocuments />
      </CardMedium>

      <ToggleContainer>
        <Skeleton height={40} width={75} />
        <Skeleton height={40} width={75} />
      </ToggleContainer>

      <CardSmall>
        <LoadingKlagemuligheter />
      </CardSmall>

      <LoadingOppgaver />

      <Card>
        <OverstyringerTop>
          <Skeleton height={40} width={150} />
          <Skeleton height={40} width={70} />
          <Skeleton height={40} width={200} />
          <Skeleton height={24} width={100} />
        </OverstyringerTop>

        <YtelseHjemler>
          <Skeleton height={40} width={300} />
          <Skeleton height={40} />
        </YtelseHjemler>

        <Parts>
          <Part />
          <Part />
          <Part />
        </Parts>
      </Card>
      <ToggleContainer>
        <Skeleton height={40} width={125} />
        <Skeleton height={40} width={125} />
      </ToggleContainer>
    </Left>
  </Container>
);

const Part = () => (
  <LoadingPart>
    <Skeleton height={24} width={100} />
    <Skeleton height={24} width={200} />
    <Skeleton height={24} width={70} />
  </LoadingPart>
);

const ToggleContainer = styled.div`
  display: flex;
  gap: 2px;
  align-self: center;
`;

const YtelseHjemler = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const OverstyringerTop = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Container = styled.div`
  width: 100%;
  padding: 16px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 50%;
`;

const LoadingPart = styled.div`
  height: 166px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  padding-left: 32px;
  border-radius: var(--a-border-radius-medium);
  border: 1px solid var(--a-border-subtle);
`;

const Parts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

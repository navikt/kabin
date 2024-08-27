import { Skeleton } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const LoadingStatus = () => (
  <Container>
    <Card>
      <Skeleton height={80} />
      <Skeleton height={30} width={600} />
      <Skeleton height={40} width={250} />
      <Horizontal>
        <Skeleton height={40} width={200} />
        <Skeleton height={40} width={160} />
        <Skeleton height={40} width={220} />
        <Skeleton height={40} width={140} />
      </Horizontal>
    </Card>

    <Main>
      <InfoCard>
        <Skeleton height={40} width={250} />

        <KeyValue />

        <KeyValue />
        <KeyValue />

        <Horizontal>
          <KeyValue min={80} max={150} />
          <KeyValue min={80} max={150} />
        </Horizontal>

        <KeyValue />
        <KeyValue />
        <KeyValue />
        <KeyValue />
      </InfoCard>

      <InfoCard>
        <Skeleton height={40} width={300} />
        <KeyValue />
        <KeyValue />
        <KeyValue />
        <KeyValue />
        <KeyValue />
        <KeyValue />
      </InfoCard>

      <InfoCard>
        <Skeleton height={40} width={300} />
        <KeyValue />
        <KeyValue />
        <Skeleton height={150} />
      </InfoCard>

      <InfoCard>
        <Skeleton height={40} width={300} />
        <KeyValue />
        <KeyValue />
        <KeyValue />
        <Horizontal>
          <KeyValue min={80} max={150} />
          <KeyValue min={80} max={150} />
        </Horizontal>
      </InfoCard>
    </Main>
  </Container>
);

const KeyValue = ({ min = 100, max = 300 }: { min?: number; max?: number }) => {
  const key = Math.floor(Math.random() * max) + min;
  const value = Math.floor(Math.random() * max) + min;

  return (
    <div>
      <Skeleton height={24} width={key} />
      <Skeleton height={24} width={value} />
    </div>
  );
};

const Card = styled.div`
  padding: 16px;
  box-shadow: var(--a-shadow-medium);
`;

const InfoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Container = styled.div`
  width: 1000px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Main = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
`;

const Horizontal = styled.div`
  display: flex;
  gap: 8px;
`;

import { styled } from 'styled-components';
import { Finished } from '@app/pages/index/finished/finished';
import { NewRegistrering } from '@app/pages/status/new-registrering';

export const IndexPage = () => (
  <PageWrapper>
    <NewRegistreringWrapper>
      <NewRegistrering orientation="vertical" />
    </NewRegistreringWrapper>
    <Finished />
  </PageWrapper>
);

const NewRegistreringWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  width: 100%;
`;

const PageWrapper = styled.main`
  overflow: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  align-items: flex-start;
`;

import { styled } from 'styled-components';
import { Drafts } from '@app/pages/index/drafts/drafts';
import { Finihed } from '@app/pages/index/finished/finished';

export const IndexPage = () => (
  <PageWrapper>
    <Drafts />
    <Finihed />
  </PageWrapper>
);

const PageWrapper = styled.main`
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  align-items: flex-start;
`;

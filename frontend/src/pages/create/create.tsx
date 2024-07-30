import { styled } from 'styled-components';
import { DocumentViewer } from '@app/components/document-viewer/document-viewer';
import { Dokumenter } from '@app/components/documents/documents';
import { Footer } from '@app/components/footer/footer';
import { Person } from '@app/pages/create/person/person';
import { RegistreringLoader } from '@app/pages/create/registrering-context';
import { DocumentViewerContextState } from './document-viewer-context';
import { TypeInput, TypeSelect } from './type-input';

export const CreatePage = () => (
  <PageWrapper>
    <RegistreringLoader>
      <StyledMain>
        <Person />
        <DocumentViewerContextState>
          <LeftColumn>
            <Dokumenter />
            <TypeSelect />
            <TypeInput />
          </LeftColumn>
          <RightColumn>
            <DocumentViewer />
          </RightColumn>
        </DocumentViewerContextState>
      </StyledMain>
      <Footer />
    </RegistreringLoader>
  </PageWrapper>
);

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  width: 100%;
  overflow: hidden;
`;

const StyledMain = styled.main`
  display: grid;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  grid-template-areas: 'search search' 'left right';
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content 1fr;
  column-gap: 0;
  width: 100%;
  flex-grow: 1;
  overflow-y: hidden;
  overflow-x: auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding-top: 8px;
  padding-bottom: 16px;
  height: 100%;
  width: 100%;
`;

const LeftColumn = styled(Column)`
  grid-area: left;
  width: fit-content;
  width: 1150px;
  overflow-y: auto;
  overflow-x: auto;
  padding-left: 16px;
  padding-right: 8px;
`;

const RightColumn = styled(Column)`
  grid-area: right;
  max-width: 1500px;
  min-width: 500px;
  overflow: hidden;
  padding-right: 16px;
  padding-left: 8px;
`;

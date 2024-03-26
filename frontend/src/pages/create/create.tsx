import { Loader } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { DocumentViewer } from '@app/components/document-viewer/document-viewer';
import { Dokumenter } from '@app/components/documents/documents';
import { Footer } from '@app/components/footer/footer';
import { usePersonSearch } from '@app/components/search/hook';
import { PersonSearch } from '@app/components/search/search';
import { useDokumenter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { AppContextState } from './app-context/app-context';
import { DocumentViewerContextState } from './document-viewer-context';
import { TypeInput, TypeSelect } from './type-input';

export const CreatePage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const personSearch = usePersonSearch();

  const { search } = personSearch;

  const { isLoading } = useDokumenter(search);

  useEffect(() => setIsInitialized((v) => (v ? v : search !== skipToken && !isLoading)), [isLoading, search]);

  return (
    <PageWrapper>
      <AppContextState fnr={search}>
        <StyledMain $isIinitialized={isInitialized}>
          <PersonSearch isInitialized={isInitialized} {...personSearch} />
          <CreatePageLoader isInitialized={isInitialized} isLoading={isLoading} />
        </StyledMain>
        <Footer />
      </AppContextState>
    </PageWrapper>
  );
};

interface LoaderProps {
  isInitialized: boolean;
  isLoading: boolean;
}

const CreatePageLoader = ({ isLoading, isInitialized }: LoaderProps) => {
  if (!isInitialized) {
    if (isLoading) {
      return <Loader size="3xlarge">Laster...</Loader>;
    }

    return null;
  }

  return (
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
  );
};

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  width: 100%;
  overflow: hidden;
`;

const StyledMain = styled.main<{ $isIinitialized: boolean }>`
  display: ${({ $isIinitialized }) => ($isIinitialized ? 'grid' : 'flex')};
  flex-direction: row;
  align-items: ${({ $isIinitialized }) => ($isIinitialized ? 'flex-start' : 'center')};
  justify-content: ${({ $isIinitialized }) => ($isIinitialized ? 'flex-start' : 'center')};
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

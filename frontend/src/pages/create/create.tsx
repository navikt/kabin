import { FileContent, FileFolder, Notes, Paragraph } from '@navikt/ds-icons';
import { BodyShort, Loader } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Ankemuligheter } from '../../components/ankemuligheter/ankemuligheter';
import { Card } from '../../components/card/card';
import { DocumentViewer } from '../../components/document-viewer/document-viewer';
import { Dokumenter } from '../../components/documents/documents';
import { Footer } from '../../components/footer/footer';
import { Overstyringer } from '../../components/overstyringer/overstyringer';
import { usePersonSearch } from '../../components/search/hook';
import { PersonSearch } from '../../components/search/search';
import { useAnkemuligheter, useDokumenter } from '../../simple-api-state/use-api';
import { IBehandling } from '../../types/behandling';
import { skipToken } from '../../types/common';
import { IArkivertDocument } from '../../types/dokument';
import { AnkeContextState } from './anke-context';
import { ApiContextState } from './api-context';
import { DocumentViewerContextState } from './document-viewer-context';

export const CreatePage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const personSearch = usePersonSearch();

  const { search } = personSearch;

  const { data: dokumenter, isLoading: dokumenterIsloading } = useDokumenter(search);
  const { data: ankemuligheter, isLoading: ankemuligheterIsLoading } = useAnkemuligheter(search);

  const isLoading = dokumenterIsloading || ankemuligheterIsLoading;

  useEffect(() => setIsInitialized((v) => (v ? v : search !== skipToken && !isLoading)), [isLoading, search]);

  return (
    <PageWrapper>
      <ApiContextState>
        <StyledMain $isIinitialized={isInitialized}>
          <PersonSearch isInitialized={isInitialized} {...personSearch} />
          <CreatePageLoader
            showPlaceholders={isInitialized && (search === skipToken || isLoading)}
            isLoading={isLoading}
            dokumenter={dokumenter?.dokumenter}
            ankemuligheter={ankemuligheter}
            fnr={search}
          />
        </StyledMain>
        <Footer fnr={search} />
      </ApiContextState>
    </PageWrapper>
  );
};

interface LoaderProps {
  fnr: string | typeof skipToken;
  dokumenter: IArkivertDocument[] | undefined;
  ankemuligheter: IBehandling[] | undefined;
  isLoading: boolean;
  showPlaceholders: boolean;
}

const CreatePageLoader = ({ fnr, dokumenter, ankemuligheter, isLoading, showPlaceholders }: LoaderProps) => {
  if (showPlaceholders) {
    return (
      <>
        <LeftColumn>
          <Card title="Dokumenter">
            <Placeholder>
              <FileFolder aria-hidden />
            </Placeholder>
          </Card>
          <Card title="Ankemuligheter">
            <Placeholder>
              <Paragraph aria-hidden />
            </Placeholder>
          </Card>
          <Card>
            <Placeholder>
              <Notes aria-hidden />
            </Placeholder>
          </Card>
        </LeftColumn>
        <RightColumn>
          <Card title="Dokument" fullHeight>
            <Placeholder>
              <FileContent aria-hidden />
            </Placeholder>
          </Card>
        </RightColumn>
      </>
    );
  }

  if (isLoading) {
    return <Loader size="3xlarge">Laster...</Loader>;
  }

  if (typeof dokumenter === 'undefined' || typeof ankemuligheter === 'undefined') {
    return null;
  }

  const [firstDokument] = dokumenter;
  const [firstAnkemulighet] = ankemuligheter;

  if (firstDokument === undefined || firstAnkemulighet === undefined) {
    return (
      <>
        <LeftColumn>
          <Card>
            <BodyShort>Ingen dokumenter eller ingen ankemuligheter funnet</BodyShort>
          </Card>
        </LeftColumn>
        <RightColumn />
      </>
    );
  }

  return (
    <AnkeContextState defaultAnkemulighet={firstAnkemulighet} defaultDokument={firstDokument} fnr={fnr}>
      <DocumentViewerContextState initialDokument={firstDokument}>
        <LeftColumn>
          <Dokumenter dokumenter={dokumenter} />
          <Ankemuligheter ankemuligheter={ankemuligheter} />
          <Overstyringer />
        </LeftColumn>
        <RightColumn>
          <DocumentViewer />
        </RightColumn>
      </DocumentViewerContextState>
    </AnkeContextState>
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
  min-width: 1000px;
  overflow-y: auto;
  overflow-x: auto;
  padding-left: 16px;
  padding-right: 8px;
`;

const RightColumn = styled(Column)`
  grid-area: right;
  max-width: 1500px;
  min-width: 750px;
  overflow: hidden;
  padding-right: 16px;
  padding-left: 8px;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--a-border-subtle);
  flex-grow: 1;
  width: 100%;
  height: 100%;
  font-size: 200px;
  padding: 32px;
`;

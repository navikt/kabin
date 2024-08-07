import { styled } from 'styled-components';
import { DocumentViewer } from '@app/components/document-viewer/document-viewer';
import { Dokumenter } from '@app/components/documents/documents';
import { Footer } from '@app/components/footer/footer';
import { useRegistrering } from '@app/hooks/use-registrering';
import { DocumentViewerContextState } from '@app/pages/registrering/document-viewer-context';
import { Person } from '@app/pages/registrering/person/person';
import { RegistreringLoader } from '@app/pages/registrering/registrering-context';
import { TypeInput, TypeSelect } from '@app/pages/registrering/type-input';
import { AnkeStatusPage } from '@app/pages/status/anke-status';
import { KlageStatusPage } from '@app/pages/status/klage-status';
import { isDraftRegistrering } from '@app/redux/api/registreringer/types';
import { SaksTypeEnum } from '@app/types/common';

export const RegistreringPage = () => (
  <PageWrapper>
    <RegistreringLoader>
      <DocumentViewerContextState>
        <Content />
      </DocumentViewerContextState>
    </RegistreringLoader>
  </PageWrapper>
);

const Content = () => {
  const registrering = useRegistrering();

  if (isDraftRegistrering(registrering)) {
    return <Create />;
  }

  if (registrering.typeId === SaksTypeEnum.KLAGE) {
    return <KlageStatusPage registrering={registrering} />;
  }

  if (registrering.typeId === SaksTypeEnum.ANKE) {
    return <AnkeStatusPage registrering={registrering} />;
  }

  console.error('Unknown sakstype for finished registrering', registrering.typeId);

  return null;
};

const Create = () => (
  <>
    <StyledMain>
      <Person />
      <LeftColumn>
        <Dokumenter />
        <TypeSelect />
        <TypeInput />
      </LeftColumn>
      <RightColumn>
        <DocumentViewer />
      </RightColumn>
    </StyledMain>
    <Footer />
  </>
);

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  width: 100%;
  overflow: auto;
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

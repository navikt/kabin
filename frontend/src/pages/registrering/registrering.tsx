import { DocumentViewer } from '@app/components/document-viewer/document-viewer';
import { Dokumenter } from '@app/components/documents/documents';
import { Footer } from '@app/components/footer/footer';
import { DocumentViewerContextState } from '@app/pages/registrering/document-viewer-context';
import { Person } from '@app/pages/registrering/person/person';
import { LeftColumn, RightColumn, StyledMain } from '@app/pages/registrering/styled-components';
import { TypeInput, TypeSelect } from '@app/pages/registrering/type-input';

export const RegistreringPage = () => (
  <DocumentViewerContextState>
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
  </DocumentViewerContextState>
);

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, Label, Tag } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { formatAvsenderMottaker } from '@app/components/documents/avsender-mottaker';
import { Journalposttype } from '@app/components/journalposttype/journalposttype';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { DocumentViewerContext } from '@app/pages/create/document-viewer-context';
import { IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';

interface Props {
  onClick: () => void;
}

export const SelectedDocument = ({ onClick }: Props) => {
  const { journalpost } = useContext(AppContext);

  if (journalpost === null) {
    return null;
  }

  return <RenderDokument dokument={journalpost} onClick={onClick} />;
};

interface RenderProps extends Props {
  dokument: IArkivertDocument;
}

const RenderDokument = ({ dokument, onClick }: RenderProps) => {
  const { tittel, temaId, datoOpprettet, avsenderMottaker, journalposttype, sak, vedlegg } = dokument;

  const temaName = useFullTemaNameFromId(temaId);

  return (
    <Card>
      <Header>
        <Heading size="small" level="1">
          Valgt journalpost
        </Heading>
        <Button
          size="small"
          variant="tertiary-neutral"
          onClick={onClick}
          icon={<ChevronDownIcon aria-hidden />}
          title="Vis alle journalposter"
        />
      </Header>
      <DocumentLine>
        <Column>
          <StyledLabel size="small">Tittel</StyledLabel>
          <Detail>{tittel}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Antall vedlegg</StyledLabel>
          <Detail>{vedlegg.length}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Tema</StyledLabel>
          <StyledTag variant="alt3" size="small" title={temaName}>
            <Ellipsis>{temaName}</Ellipsis>
          </StyledTag>
        </Column>
        <Column>
          <StyledLabel size="small">Dato</StyledLabel>
          <Detail as="time" dateTime={datoOpprettet}>
            {isoDateTimeToPrettyDate(datoOpprettet) ?? ''}
          </Detail>
        </Column>
        <AvsenderMottaker journalposttype={journalposttype} avsenderMottaker={avsenderMottaker} />
        <Column>
          <StyledLabel size="small">Saks-ID</StyledLabel>
          <Detail>{sak?.fagsakId ?? 'Ingen'}</Detail>
        </Column>
        <Column>
          <StyledLabel size="small">Type</StyledLabel>
          <Journalposttype journalposttype={journalposttype} />
        </Column>
        <ViewDocumentButton dokument={dokument} />
      </DocumentLine>
    </Card>
  );
};

interface VirewDocumentButtonProps {
  dokument: IArkivertDocument;
}

const ViewDocumentButton = ({ dokument }: VirewDocumentButtonProps) => {
  const { dokument: viewedDokument, viewDokument } = useContext(DocumentViewerContext);

  if (
    viewedDokument?.dokumentInfoId === dokument.dokumentInfoId &&
    viewedDokument?.journalpostId === dokument.journalpostId
  ) {
    return null;
  }

  return (
    <Button size="small" onClick={() => viewDokument(dokument)}>
      Se dokument
    </Button>
  );
};

type AvsenderMottakerProps = Pick<IArkivertDocument, 'journalposttype' | 'avsenderMottaker'>;

const AvsenderMottaker = ({ journalposttype, avsenderMottaker }: AvsenderMottakerProps) => {
  if (journalposttype === JournalposttypeEnum.NOTAT) {
    return null;
  }

  const title = journalposttype === JournalposttypeEnum.INNGAAENDE ? 'Mottaker' : 'Avsender';

  return (
    <Column>
      <Label size="small">{title}</Label>
      <Detail>{formatAvsenderMottaker(avsenderMottaker)}</Detail>
    </Column>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DocumentLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  column-gap: 16px;
  background-color: var(--a-blue-50);
  border: 1px solid var(--a-blue-200);
  padding: 16px;
  border-radius: 4px;
`;

const Ellipsis = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const StyledLabel = styled(Label)`
  white-space: nowrap;
`;

const StyledTag = styled(Tag)`
  max-width: 150px;
`;

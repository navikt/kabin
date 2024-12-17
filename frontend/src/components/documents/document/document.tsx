import { AttachmentList } from '@app/components/documents/document/attachment-list';
import { AvsenderMottakerNotatforer } from '@app/components/documents/document/avsender-mottaker-notatforer';
import { DocumentTitle } from '@app/components/documents/document/document-title';
import { ExpandButton } from '@app/components/documents/document/expand-button';
import { SelectDocumentButton } from '@app/components/documents/document/select-document-button';
import { useViewDocument } from '@app/components/documents/document/use-view-document';
import { ViewDocumentButton } from '@app/components/documents/document/view-document-button';
import { GridArea, GridTag, StyledField, StyledGrid } from '@app/components/documents/styled-grid-components';
import { Journalposttype } from '@app/components/journalposttype/journalposttype';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { useRegistrering } from '@app/hooks/use-registrering';
import type { IArkivertDocument } from '@app/types/dokument';
import { styled } from 'styled-components';

interface Props {
  dokument: IArkivertDocument;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export const Dokument = ({ dokument, isExpanded, toggleExpanded }: Props) => {
  const registrering = useRegistrering();
  const {
    dokumentInfoId,
    journalpostId,
    tittel,
    datoOpprettet,
    temaId,
    sak,
    journalposttype,
    harTilgangTilArkivvariant,
  } = dokument;

  const temaName = useFullTemaNameFromId(temaId);

  const isSelected = registrering.journalpostId === journalpostId;

  const [viewDocument, isViewed] = useViewDocument({
    journalpostId,
    dokumentInfoId,
    tittel,
    harTilgangTilArkivvariant,
  });

  const hasVedlegg = dokument.vedlegg.length !== 0 || dokument.logiskeVedlegg.length !== 0;
  const canExpand = hasVedlegg || harTilgangTilArkivvariant;

  const title = tittel ?? '';

  return (
    <DocumentListItem $isSelected={isSelected} $clickable={harTilgangTilArkivvariant} aria-label={title}>
      <StyledGrid
        as="article"
        data-testid="document"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
        $showViewed={isViewed && !isSelected}
        onMouseDown={viewDocument}
      >
        {canExpand ? <ExpandButton isExpanded={isExpanded} toggleExpanded={toggleExpanded} /> : null}
        <TitleContainer aria-label="Dokumenttittel">
          <DocumentTitle journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} tittel={title} />
        </TitleContainer>
        <GridTag variant="alt3" size="small" title={temaName} $gridArea={GridArea.TEMA}>
          <Ellipsis>{temaName}</Ellipsis>
        </GridTag>
        <StyledDate dateTime={datoOpprettet}>{isoDateTimeToPrettyDate(datoOpprettet)}</StyledDate>
        <AvsenderMottakerNotatforer {...dokument} />
        <StyledField $gridArea={GridArea.SAKS_ID}>{sak?.fagsakId ?? 'Ingen'}</StyledField>
        <StyledField $gridArea={GridArea.TYPE}>
          <Journalposttype journalposttype={journalposttype} />
        </StyledField>
        <ViewDocumentButton
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          tittel={tittel}
        />
        <SelectDocumentButton
          isSelected={isSelected}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          alreadyUsed={dokument.alreadyUsed}
          dokument={dokument}
        />
      </StyledGrid>
      <AttachmentList dokument={dokument} isOpen={isExpanded} temaId={temaId} />
    </DocumentListItem>
  );
};

const DocumentListItem = styled.li<{ $isSelected: boolean; $clickable: boolean }>`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  border-radius: var(--a-border-radius-medium);
  background-color: ${({ $isSelected }) => ($isSelected ? 'var(--a-surface-selected)' : 'var(--a-white)')};

  &:nth-child(odd) {
    background-color: ${({ $isSelected }) => ($isSelected ? 'var(--a-surface-selected)' : 'var(--a-surface-subtle)')};
  }

  &:hover {
    background-color: var(--a-surface-active);
  }
`;

const Ellipsis = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  width: 100%;
`;

const StyledDate = styled.time`
  display: flex;
  align-items: center;
  grid-area: ${GridArea.DATE};
`;

const TitleContainer = styled.div`
  grid-area: ${GridArea.TITLE};
  position: relative;
`;

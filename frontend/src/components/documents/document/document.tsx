import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { useViewDocument } from '@app/components/documents/document/use-view-document';
import { ViewDocumentButton } from '@app/components/documents/document/view-document-button';
import { Journalposttype } from '@app/components/journalposttype/journalposttype';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { IArkivertDocument, JournalposttypeEnum } from '@app/types/dokument';
import { GridArea, GridTag, StyledField, StyledGrid } from '../styled-grid-components';
import { AttachmentList } from './attachment-list';
import { AvsenderMottakerNotatforer } from './avsender-mottaker-notatforer';
import { DocumentTitle } from './document-title';
import { StyledExpandButton } from './expand-button';
import { SelectDocumentButton } from './select-document-button';

interface Props {
  dokument: IArkivertDocument;
}

export const Dokument = ({ dokument }: Props) => {
  const { journalpost } = useContext(AppContext);
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

  const isSelected = journalpost?.journalpostId === journalpostId;

  const [viewDocument, isViewed] = useViewDocument({
    journalpostId,
    dokumentInfoId,
    tittel,
    harTilgangTilArkivvariant,
  });

  const hasVedlegg = dokument.vedlegg.length !== 0 || dokument.logiskeVedlegg.length !== 0;
  const canExpand = hasVedlegg || (harTilgangTilArkivvariant && journalposttype === JournalposttypeEnum.INNGAAENDE);
  const [isExpanded, setIsExpanded] = useState(hasVedlegg);

  return (
    <DocumentListItem $isSelected={isSelected} $clickable={harTilgangTilArkivvariant}>
      <StyledGrid
        as="article"
        data-testid="document"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
        $showViewed={isViewed && !isSelected}
        onMouseDown={viewDocument}
      >
        <TitleContainer>
          {canExpand ? <StyledExpandButton isExpanded={isExpanded} setIsExpanded={setIsExpanded} /> : null}
          <DocumentTitle journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} tittel={tittel ?? ''} />
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
`;

const TitleContainer = styled.div`
  grid-area: ${GridArea.TITLE};
  position: relative;
  padding-left: 32px;
`;

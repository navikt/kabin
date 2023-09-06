import React, { useContext, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { useViewDocument } from '@app/components/documents/use-view-document';
import { ViewDocumentButton } from '@app/components/documents/view-document-button';
import { Journalposttype } from '@app/components/journalposttype/journalposttype';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { IArkivertDocument } from '@app/types/dokument';
import { AttachmentList } from '../attachment-list';
import { DocumentTitle } from '../document-title';
import { SelectDocumentButton } from '../select-document-button';
import { GridArea, GridTag, StyledField, StyledGrid } from '../styled-grid-components';
import { AvsenderMottakerNotatforer } from './avsender-mottaker-notatforer';
import { StyledExpandButton } from './expand-button';

interface Props {
  dokument: IArkivertDocument;
}

export const Dokument = ({ dokument }: Props) => {
  const { journalpost } = useContext(ApiContext);
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

  const [isExpanded, setIsExpanded] = useState(true);

  const title = useMemo(() => {
    if (!harTilgangTilArkivvariant) {
      return 'Du har ikke tilgang til å se dokumentet.';
    }

    if (isViewed && isSelected) {
      return 'Dokumentet er åpnet og valgt.';
    }

    if (isViewed) {
      return 'Dokumentet er åpnet.';
    }

    if (isSelected) {
      return 'Dokumentet er valgt. Trykk for å åpne.';
    }

    return 'Åpne dokumentet.';
  }, [harTilgangTilArkivvariant, isSelected, isViewed]);

  return (
    <DocumentListItem $isSelected={isSelected} $clickable={harTilgangTilArkivvariant} title={title}>
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
          <StyledExpandButton
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            hasVedlegg={dokument.vedlegg.length !== 0}
          />
          <DocumentTitle journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} tittel={tittel ?? ''} />
        </TitleContainer>
        <GridTag variant="alt3" size="medium" title={temaName} $gridArea={GridArea.TEMA}>
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
      <AttachmentList dokument={dokument} isOpen={isExpanded} />
    </DocumentListItem>
  );
};

const DocumentListItem = styled.li<{ $isSelected: boolean; $clickable: boolean }>`
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  border-radius: 4px;
  background-color: ${({ $isSelected }) => ($isSelected ? 'var(--a-surface-selected)' : 'var(--a-white)')};

  &:nth-child(odd) {
    background-color: ${({ $isSelected }) => ($isSelected ? 'var(--a-surface-selected)' : 'var(--a-surface-subtle)')};
  }

  &:hover {
    background-color: var(--a-surface-action-subtle-hover);
  }
`;

const Ellipsis = styled.div`
  font-size: 16px;
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

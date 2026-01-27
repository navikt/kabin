import { ExclamationmarkTriangleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { AttachmentList } from '@app/components/documents/document/attachment-list';
import { AvsenderMottakerNotatforer } from '@app/components/documents/document/avsender-mottaker-notatforer';
import { DocumentTitle } from '@app/components/documents/document/document-title';
import { ExpandButton } from '@app/components/documents/document/expand-button';
import { canOpen } from '@app/components/documents/document/filetype';
import { SelectDocumentButton } from '@app/components/documents/document/select-document-button';
import type { BaseSelectDocumentProps } from '@app/components/documents/document/types';
import { useViewDocument } from '@app/components/documents/document/use-view-document';
import { ViewDocumentButton } from '@app/components/documents/document/view-document-button';
import { GridArea, GridTag, StyledField, StyledGrid } from '@app/components/documents/styled-grid-components';
import { Journalposttype } from '@app/components/journalposttype/journalposttype';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { useFullTemaNameFromId } from '@app/hooks/kodeverk';
import type { IArkivertDocument } from '@app/types/dokument';
import { Tooltip } from '@navikt/ds-react';
import type { CSSProperties } from 'react';
import type { RowComponentProps } from 'react-window';
import { styled } from 'styled-components';

interface Props extends BaseSelectDocumentProps {
  dokument: IArkivertDocument;
  isExpanded: boolean;
  toggleExpanded: () => void;
  style: CSSProperties;
  ariaAttributes: RowComponentProps['ariaAttributes'];
}

export const Dokument = ({
  dokument,
  isExpanded,
  toggleExpanded,
  selectJournalpost,
  getIsSelected,
  getCanBeSelected,
  style,
  ariaAttributes,
}: Props) => {
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

  const isSelected = getIsSelected(journalpostId);

  const [viewDocument, isViewed] = useViewDocument(dokument);

  const hasVedlegg = dokument.vedlegg.length !== 0 || dokument.logiskeVedlegg.length !== 0;
  const canExpand = hasVedlegg || harTilgangTilArkivvariant;

  const title = tittel ?? '';

  const isDownload = !canOpen(dokument.varianter);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!harTilgangTilArkivvariant) {
      return;
    }

    if (!isDownload) {
      return viewDocument(e);
    }

    window.location.href = `/api/kabin-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;
  };

  return (
    <DocumentListItem
      $isSelected={isSelected}
      $clickable={harTilgangTilArkivvariant}
      aria-label={title}
      style={style}
      {...ariaAttributes}
    >
      <StyledGrid
        as="article"
        data-testid="document"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
        $showViewed={isViewed && !isSelected}
        onMouseDown={onMouseDown}
      >
        {canExpand ? <ExpandButton isExpanded={isExpanded} toggleExpanded={toggleExpanded} /> : null}
        <TitleContainer aria-label="Dokumenttittel">
          <DocumentTitle dokument={dokument} />
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
          viewDocument={onMouseDown}
          isViewed={isViewed}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          isDownload={isDownload}
        />
        <SelectDocumentButton
          isSelected={isSelected}
          dokument={dokument}
          selectJournalpost={selectJournalpost}
          getCanBeSelected={getCanBeSelected}
        />
        {dokument.alreadyUsed ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip content="Dette dokumentet er allerede brukt i en annen registrering.">
              <ExclamationmarkTriangleFillIconColored aria-hidden fontSize={20} />
            </Tooltip>
          </div>
        ) : null}
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
  border-radius: var(--ax-radius-4);
  background-color: ${({ $isSelected }) => ($isSelected ? 'var(--ax-bg-accent-soft)' : 'var(--ax-bg-default)')};

  &:nth-child(odd) {
    background-color: ${({ $isSelected }) => ($isSelected ? 'var(--ax-bg-accent-soft)' : 'var(--ax-bg-neutral-moderate)')};
  }

  &:hover {
    background-color: var(--ax-bg-neutral-moderate-pressedA);
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

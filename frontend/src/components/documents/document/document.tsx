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
import { HStack, Tooltip, VStack } from '@navikt/ds-react';
import type { CSSProperties } from 'react';
import type { RowComponentProps } from 'react-window';

interface Props extends BaseSelectDocumentProps {
  dokument: IArkivertDocument;
  isExpanded: boolean;
  toggleExpanded: () => void;
  style: CSSProperties;
  ariaAttributes: RowComponentProps['ariaAttributes'];
  isOdd?: boolean;
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
  isOdd = false,
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

  const getBackgroundClass = () => {
    if (isSelected) {
      return 'bg-ax-bg-accent-soft';
    }
    if (isOdd) {
      return 'bg-ax-bg-default';
    }
    return 'bg-ax-bg-neutral-moderate';
  };

  return (
    <VStack
      as="li"
      gap="space-4"
      className={`rounded ${harTilgangTilArkivvariant ? 'cursor-pointer' : 'cursor-default'} ${getBackgroundClass()} hover:bg-ax-bg-neutral-moderate-pressedA`}
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
        showViewed={isViewed && !isSelected}
        onMouseDown={onMouseDown}
      >
        {canExpand ? <ExpandButton isExpanded={isExpanded} toggleExpanded={toggleExpanded} /> : null}
        <div className="relative" style={{ gridArea: GridArea.TITLE }}>
          <DocumentTitle dokument={dokument} />
        </div>
        <GridTag variant="alt3" size="small" title={temaName} gridArea={GridArea.TEMA}>
          <span className="w-full truncate text-left">{temaName}</span>
        </GridTag>
        <HStack as="time" align="center" wrap={false} style={{ gridArea: GridArea.DATE }} dateTime={datoOpprettet}>
          {isoDateTimeToPrettyDate(datoOpprettet)}
        </HStack>
        <AvsenderMottakerNotatforer {...dokument} />
        <StyledField gridArea={GridArea.SAKS_ID}>{sak?.fagsakId ?? 'Ingen'}</StyledField>
        <StyledField gridArea={GridArea.TYPE}>
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
          <div className="flex items-center">
            <Tooltip content="Dette dokumentet er allerede brukt i en annen registrering.">
              <ExclamationmarkTriangleFillIconColored aria-hidden fontSize={20} />
            </Tooltip>
          </div>
        ) : null}
      </StyledGrid>
      <AttachmentList dokument={dokument} isOpen={isExpanded} temaId={temaId} />
    </VStack>
  );
};

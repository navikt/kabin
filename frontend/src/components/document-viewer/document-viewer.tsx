import { AppTheme, useAppTheme } from '@app/app-theme';
import { CardFullHeight } from '@app/components/card/card';
import { DocumentTitle } from '@app/components/document-viewer/document-title';
import { UploadedDocumentTitle } from '@app/components/document-viewer/uploaded-document-title';
import { getDocumentUrl } from '@app/components/documents/journalpost/document/use-view-document';
import { ContentType } from '@app/components/documents/upload/content-type';
import { getUploadedDocumentUrl } from '@app/components/documents/upload/get-uploaded-document-url';
import { Placeholder } from '@app/components/placeholder/placeholder';
import {
  DocumentViewerContext,
  isViewedUploadedDokument,
  type ViewedVedlegg,
} from '@app/pages/registrering/document-viewer-context';
import { type IArkivertDocument, VariantFormat } from '@app/types/dokument';
import {
  FileCsvIcon,
  FileExcelIcon,
  FileIcon,
  FileImageIcon,
  FileJpegIcon,
  FileJsonIcon,
  FilePngIcon,
  FileTextIcon,
  FileWordIcon,
} from '@navikt/aksel-icons';
import { Button, Loader, VStack } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';

const DEFAULT_NAME = '<Mangler navn>';

export const DocumentViewer = () => {
  const { dokument } = useContext(DocumentViewerContext);

  if (dokument === null) {
    return (
      <CardFullHeight>
        <VStack position="relative" width="100%" flexGrow="1" className="rounded">
          <Placeholder>
            <FileTextIcon aria-hidden />
          </Placeholder>
        </VStack>
      </CardFullHeight>
    );
  }

  return (
    <CardFullHeight>
      <VStack position="relative" width="100%" flexGrow="1" className="rounded">
        {isViewedUploadedDokument(dokument) ? <UploadedContent dokument={dokument} /> : <Content dokument={dokument} />}
      </VStack>
    </CardFullHeight>
  );
};

interface IUploadedContentProps {
  dokument: { registreringId: string; dokumentId: string; name: string; contentType: string };
}

const UploadedContent = ({ dokument }: IUploadedContentProps) => {
  const url = getUploadedDocumentUrl(dokument.registreringId, dokument.dokumentId);

  return (
    <>
      <UploadedDocumentTitle name={dokument.name} url={url} />
      {dokument.contentType === ContentType.PDF ? (
        <PDF tittel={dokument.name} url={url} />
      ) : (
        <DownloadFallback tittel={dokument.name} url={url} contentType={dokument.contentType} />
      )}
    </>
  );
};

interface IContentProps {
  dokument: IArkivertDocument | ViewedVedlegg;
}

const Content = ({ dokument }: IContentProps) => {
  const hasRedactedDocument = dokument.varianter.some(({ format }) => format === VariantFormat.SLADDET);
  const [showRedacted, setShowRedacted] = useState(hasRedactedDocument);

  useEffect(() => {
    setShowRedacted(hasRedactedDocument);
  }, [hasRedactedDocument]);

  const format = showRedacted ? VariantFormat.SLADDET : VariantFormat.ARKIV;
  const url = getDocumentUrl(dokument.journalpostId, dokument.dokumentInfoId, { format });

  return (
    <>
      <DocumentTitle
        url={url}
        format={format}
        hasRedactedDocument={hasRedactedDocument}
        showRedacted={showRedacted}
        setShowRedacted={setShowRedacted}
      />
      <PDF tittel={dokument.tittel} url={url} />
    </>
  );
};

interface PDFProps {
  url: string;
  tittel: string | null;
}

const PDF = ({ url, tittel }: PDFProps) => {
  const appTheme = useAppTheme();

  return (
    <>
      <Loader size="3xlarge" className="absolute top-[30%] left-[42.5%] z-0 w-[15%]" />
      <object
        className="relative z-1 w-full grow"
        data={`${url}#toolbar=1&view=fitH&zoom=page-width`}
        type="application/pdf"
        name={tittel ?? DEFAULT_NAME}
        id="document-viewer"
        style={{ filter: appTheme === AppTheme.DARK ? 'hue-rotate(180deg) invert(1)' : 'none' }}
        aria-label={tittel ?? DEFAULT_NAME}
      />
    </>
  );
};

interface DownloadFallbackProps extends PDFProps {
  contentType: string;
}

const DownloadFallback = ({ url, tittel, contentType }: DownloadFallbackProps) => {
  const Icon = getContentTypeIcon(contentType);

  return (
    <VStack align="center" justify="center" flexGrow="1" gap="space-16">
      <Icon aria-hidden fontSize="3rem" className="text-ax-icon-neutral-subtle" />
      <Button as="a" variant="secondary" href={url} download={tittel ?? DEFAULT_NAME}>
        Last ned {tittel ?? DEFAULT_NAME}
      </Button>
    </VStack>
  );
};

/** Icons for content types the user might realistically upload, beyond the ones actively accepted
 * (`ContentType`) — the backend accepts any file, so this covers common real-world types too. */
const ICON_BY_CONTENT_TYPE: Record<string, typeof FileIcon> = {
  [ContentType.JPEG]: FileJpegIcon,
  [ContentType.PNG]: FilePngIcon,
  [ContentType.TIFF]: FileImageIcon,
  'image/gif': FileImageIcon,
  'image/webp': FileImageIcon,
  'image/bmp': FileImageIcon,
  'application/vnd.ms-excel': FileExcelIcon,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileExcelIcon,
  'application/msword': FileWordIcon,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileWordIcon,
  'text/csv': FileCsvIcon,
  'application/json': FileJsonIcon,
  'text/plain': FileTextIcon,
};

const getContentTypeIcon = (contentType: string) => {
  const icon = ICON_BY_CONTENT_TYPE[contentType];

  if (icon !== undefined) {
    return icon;
  }

  return contentType.startsWith('image/') ? FileImageIcon : FileIcon;
};

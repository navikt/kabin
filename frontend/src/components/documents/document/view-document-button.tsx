import { DownloadIcon, GlassesFillIcon, GlassesIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

interface Props {
  harTilgangTilArkivvariant: boolean;
  viewDocument: (e: React.MouseEvent) => void;
  isViewed: boolean;
  isDownload: boolean;
}

export const ViewDocumentButton = ({ viewDocument, isViewed, harTilgangTilArkivvariant, isDownload }: Props) => {
  if (!harTilgangTilArkivvariant) {
    return null;
  }

  return (
    <Tooltip content={getTooltip(isViewed, isDownload)} placement="top">
      <Button
        className="[grid-area:view]"
        size="small"
        variant="tertiary-neutral"
        onMouseDown={viewDocument}
        aria-pressed={isViewed}
        aria-controls="document-viewer"
        icon={getIcon(isViewed, isDownload)}
      />
    </Tooltip>
  );
};

const getIcon = (isViewed: boolean, isDownload: boolean) => {
  if (isDownload) {
    return <DownloadIcon aria-hidden role="presentation" />;
  }

  return isViewed ? (
    <GlassesFillIcon aria-hidden role="presentation" />
  ) : (
    <GlassesIcon aria-hidden role="presentation" />
  );
};

const getTooltip = (isViewed: boolean, isDownload: boolean) => {
  if (isDownload) {
    return 'Last ned dokumentet';
  }

  return isViewed ? 'Åpnet' : 'Åpne dokumentet';
};

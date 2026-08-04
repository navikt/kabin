import { DocumentViewerContext } from '@app/pages/registrering/document-viewer-context';
import { ExternalLinkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  name: string;
  url: string;
}

export const UploadedDocumentTitle = ({ name, url }: Props) => {
  const { viewDokument } = useContext(DocumentViewerContext);

  return (
    <HStack align="center" gap="space-8" marginBlock="space-0 space-1" width="100%">
      <Tooltip content="Åpne i nytt vindu" placement="top">
        <Button
          data-color="neutral"
          as="a"
          variant="tertiary"
          icon={<ExternalLinkIcon aria-hidden />}
          size="small"
          href={url}
          target="_blank"
          rel="noreferrer"
        />
      </Tooltip>
      <Heading size="small" level="1">
        {name}
      </Heading>
      <Tooltip content="Lukk" placement="top">
        <Button
          className="ml-auto"
          variant="tertiary-neutral"
          size="small"
          icon={<XMarkIcon aria-hidden />}
          onClick={() => viewDokument(null)}
        />
      </Tooltip>
    </HStack>
  );
};

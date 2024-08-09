import { ExternalLinkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Heading, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { DocumentViewerContext } from '@app/pages/registrering/document-viewer-context';

interface Props {
  url: string;
}

export const DocumentTitle = ({ url }: Props) => {
  const { journalpost } = useJournalpost();
  const { dokument, viewDokument } = useContext(DocumentViewerContext);

  if (dokument === null) {
    return null;
  }

  const isSelected = journalpost?.journalpostId === dokument.journalpostId;

  return (
    <StyledDocumentTitle>
      <Tooltip content="Åpne i nytt vindu" placement="top">
        <Button
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
        {dokument?.tittel ?? ''}
      </Heading>
      {isSelected ? <CheckmarkCircleFillIconColored fontSize={28} /> : null}
      <Tooltip content="Lukk" placement="top">
        <RightAlignedButton
          variant="tertiary"
          size="small"
          icon={<XMarkIcon aria-hidden />}
          onClick={() => viewDokument(null)}
        />
      </Tooltip>
    </StyledDocumentTitle>
  );
};

const StyledDocumentTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const RightAlignedButton = styled(Button)`
  margin-left: auto;
`;

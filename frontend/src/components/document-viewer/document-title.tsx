import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { FeilTag, PolTag } from '@app/components/documents/document/document-warnings';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { DocumentViewerContext } from '@app/pages/registrering/document-viewer-context';
import { Skjerming, VariantFormat } from '@app/types/dokument';
import { ExternalLinkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, Switch, Tag, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';

interface Props extends VariantProps {
  url: string;
}

export const DocumentTitle = ({ url, ...props }: Props) => {
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
        {dokument?.tittel ?? ''}
      </Heading>
      <Variant {...props} />
      {isSelected ? <CheckmarkCircleFillIconColored fontSize={28} /> : null}
      <Tooltip content="Lukk" placement="top">
        <RightAlignedButton
          variant="tertiary-neutral"
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
  margin-bottom: 4px;
`;

const RightAlignedButton = styled(Button)`
  margin-left: auto;
`;

interface VariantProps extends RedactedSwitchProps {
  format: VariantFormat;
}

const Variant = ({ format, ...props }: VariantProps) => {
  const { dokument } = useContext(DocumentViewerContext);

  if (!dokument) {
    return null;
  }

  const showsPol = dokument.varianter.some((v) => v.hasAccess && v.format === format && v.skjerming === Skjerming.POL);
  const showsFeil = dokument.varianter.some(
    (v) => v.hasAccess && v.format === format && v.skjerming === Skjerming.FEIL,
  );

  return (
    <HStack gap="space-8" wrap={false}>
      <RedactedSwitch {...props} />
      {showsPol ? <PolTag /> : null}
      {showsFeil ? <FeilTag /> : null}
    </HStack>
  );
};

interface RedactedSwitchProps {
  hasRedactedDocument: boolean;
  showRedacted: boolean;
  setShowRedacted: (value: boolean) => void;
}

const RedactedSwitch = ({ showRedacted, setShowRedacted, hasRedactedDocument }: RedactedSwitchProps) => {
  const { dokument } = useContext(DocumentViewerContext);

  if (!hasRedactedDocument || dokument === null) {
    return null;
  }

  const hasAccessToArchivedDocuments = dokument.varianter.some((v) => v.hasAccess && v.format === VariantFormat.ARKIV);

  if (!hasAccessToArchivedDocuments) {
    return (
      <Tooltip content="Du har ikke tilgang til å se usladdet versjon" placement="top">
        <Tag data-color="meta-purple" variant="strong" size="small">
          Sladdet
        </Tag>
      </Tooltip>
    );
  }

  return (
    <Switch size="small" checked={showRedacted} onChange={() => setShowRedacted(!showRedacted)} className="py-0">
      Sladdet
    </Switch>
  );
};

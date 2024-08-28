import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { GridArea, GridButton } from '@app/components/documents/styled-grid-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useSetJournalpostIdMutation } from '@app/redux/api/registreringer/mutations';
import type { IArkivertDocument } from '@app/types/dokument';
import { CircleSlashIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';

interface Props {
  isSelected: boolean;
  harTilgangTilArkivvariant: boolean;
  alreadyUsed: boolean;
  dokument: IArkivertDocument;
}

export const SelectDocumentButton = ({ harTilgangTilArkivvariant, isSelected, alreadyUsed, dokument }: Props) => {
  const { id } = useRegistrering();
  const [setJournalpostId, { isLoading }] = useSetJournalpostIdMutation({
    fixedCacheKey: `${dokument.journalpostId}-${dokument.dokumentInfoId}`,
  });
  const canEdit = useCanEdit();

  const selectJournalpost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (e.button !== 0 || !harTilgangTilArkivvariant) {
        return;
      }

      setJournalpostId({ id, journalpostId: dokument.journalpostId });
    },
    [dokument.journalpostId, harTilgangTilArkivvariant, id, setJournalpostId],
  );

  if (!canEdit) {
    return isSelected ? <ReadOnlyCheckmark aria-label="Valgt" fontSize={20} /> : null;
  }

  return (
    <Tooltip content={getTitle(harTilgangTilArkivvariant, alreadyUsed)} placement="top">
      <GridButton
        disabled={!harTilgangTilArkivvariant}
        size="small"
        variant="tertiary"
        icon={getIcon(harTilgangTilArkivvariant, isSelected)}
        onMouseDown={selectJournalpost}
        aria-pressed={isSelected}
        data-testid="select-document"
        $gridArea={GridArea.SELECT}
        loading={isLoading}
        title={isSelected ? 'Valgt' : undefined}
      >
        {getText(harTilgangTilArkivvariant, isSelected)}
      </GridButton>
    </Tooltip>
  );
};

const getTitle = (harTilgangTilArkivvariant: boolean, alreadyUsed: boolean) => {
  if (!harTilgangTilArkivvariant) {
    return 'Du har ikke tilgang til dette dokumentet';
  }

  if (alreadyUsed) {
    return 'Dette dokumentet er allerede benyttet i en eksisterende klage eller anke';
  }

  return 'Velg dokumentet';
};

const getText = (harTilgangTilArkivvariant: boolean, isSelected: boolean) => {
  if (!harTilgangTilArkivvariant || isSelected) {
    return null;
  }

  return 'Velg';
};

const getIcon = (harTilgangTilArkivvariant: boolean, isSelected: boolean) => {
  if (!harTilgangTilArkivvariant) {
    return <CircleSlashIcon aria-hidden role="presentation" />;
  }

  if (isSelected) {
    return <CheckmarkCircleFillIconColored />;
  }

  return undefined;
};

const ReadOnlyCheckmark = styled(CheckmarkCircleFillIconColored)`
  grid-area: ${GridArea.SELECT};
  align-self: center;
  justify-self: center;
`;

import { CircleSlashIcon } from '@navikt/aksel-icons';
import React, { useCallback, useContext } from 'react';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { IArkivertDocument } from '@app/types/dokument';
import { GridArea, GridButton } from './styled-grid-components';

interface Props {
  isSelected: boolean;
  harTilgangTilArkivvariant: boolean;
  alreadyUsed: boolean;
  dokument: IArkivertDocument;
}

export const SelectDocumentButton = ({ harTilgangTilArkivvariant, isSelected, alreadyUsed, dokument }: Props) => {
  const { setJournalpost } = useContext(ApiContext);

  const selectJournalpost = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (e.button !== 0) {
        return;
      }

      setJournalpost(harTilgangTilArkivvariant ? dokument : null);
    },
    [dokument, harTilgangTilArkivvariant, setJournalpost],
  );

  return (
    <GridButton
      disabled={!harTilgangTilArkivvariant}
      size="small"
      variant="tertiary"
      icon={getIcon(harTilgangTilArkivvariant, isSelected)}
      onMouseDown={selectJournalpost}
      aria-pressed={isSelected}
      data-testid="select-document"
      $gridArea={GridArea.SELECT}
      title={getTitle(harTilgangTilArkivvariant, alreadyUsed)}
    >
      {getText(harTilgangTilArkivvariant, isSelected)}
    </GridButton>
  );
};

const getTitle = (harTilgangTilArkivvariant: boolean, alreadyUsed: boolean) => {
  if (!harTilgangTilArkivvariant) {
    return 'Du har ikke tilgang til dette dokumentet';
  }

  if (alreadyUsed) {
    return 'Dette dokumentet er allerede benyttet i en eksisterende klage eller anke';
  }
};

const getText = (harTilgangTilArkivvariant: boolean, isSelected: boolean) => {
  if (!harTilgangTilArkivvariant || isSelected) {
    return null;
  }

  return 'Velg';
};

const getIcon = (harTilgangTilArkivvariant: boolean, isSelected: boolean) => {
  if (!harTilgangTilArkivvariant) {
    return <CircleSlashIcon />;
  }

  if (isSelected) {
    return <CheckmarkCircleFillIconColored />;
  }

  return undefined;
};

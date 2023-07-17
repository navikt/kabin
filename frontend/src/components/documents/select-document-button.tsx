import { CircleSlashIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
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

      if (harTilgangTilArkivvariant) {
        if (!alreadyUsed) {
          setJournalpost(dokument);
        }
      } else {
        setJournalpost(null);
      }
    },
    [alreadyUsed, dokument, harTilgangTilArkivvariant, setJournalpost],
  );

  return (
    <GridButton
      disabled={!harTilgangTilArkivvariant || alreadyUsed}
      size="small"
      variant="tertiary"
      icon={getIcon(harTilgangTilArkivvariant, alreadyUsed, isSelected)}
      onMouseDown={selectJournalpost}
      aria-pressed={isSelected}
      data-testid="select-document"
      $gridArea={GridArea.SELECT}
      title={getTitle(harTilgangTilArkivvariant, alreadyUsed)}
    >
      {getText(harTilgangTilArkivvariant, alreadyUsed, isSelected)}
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

const getText = (harTilgangTilArkivvariant: boolean, alreadyUsed: boolean, isSelected: boolean) => {
  if (!harTilgangTilArkivvariant || alreadyUsed || isSelected) {
    return '';
  }

  return 'Velg';
};

const getIcon = (harTilgangTilArkivvariant: boolean, alreadyUsed: boolean, isSelected: boolean) => {
  if (!harTilgangTilArkivvariant) {
    return <CircleSlashIcon />;
  }

  if (alreadyUsed) {
    return <ExclamationmarkTriangleIcon />;
  }

  if (isSelected) {
    return <CheckmarkCircleFillIconColored />;
  }

  return undefined;
};

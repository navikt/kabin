import { CircleSlashIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { IArkivertDocument } from '@app/types/dokument';
import { GridArea, GridButton } from '../styled-grid-components';

interface Props {
  isSelected: boolean;
  harTilgangTilArkivvariant: boolean;
  alreadyUsed: boolean;
  dokument: IArkivertDocument;
}

export const SelectDocumentButton = ({ harTilgangTilArkivvariant, isSelected, alreadyUsed, dokument }: Props) => {
  const { setJournalpost } = useContext(AppContext);

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
    return <CircleSlashIcon />;
  }

  if (isSelected) {
    return <CheckmarkCircleFillIconColored />;
  }

  return undefined;
};

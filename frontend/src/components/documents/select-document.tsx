import { CircleSlashIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import React from 'react';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { GridArea, GridButton } from './styled-grid-components';

interface Props {
  isSelected: boolean;
  selectJournalpost: (e: React.MouseEvent) => void;
  harTilgangTilArkivvariant: boolean;
  alreadyUsed: boolean;
}

export const SelectDocument = ({ harTilgangTilArkivvariant, isSelected, selectJournalpost, alreadyUsed }: Props) => (
  <GridButton
    disabled={!harTilgangTilArkivvariant || alreadyUsed}
    size="small"
    variant="tertiary"
    icon={getIcon(harTilgangTilArkivvariant, alreadyUsed, isSelected)}
    onClick={selectJournalpost}
    aria-pressed={isSelected}
    data-testid="select-document"
    $gridArea={GridArea.SELECT}
    title={getTitle(harTilgangTilArkivvariant, alreadyUsed)}
  >
    {getText(harTilgangTilArkivvariant, alreadyUsed, isSelected)}
  </GridButton>
);

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

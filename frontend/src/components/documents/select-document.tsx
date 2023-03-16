import { CircleSlashIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import React from 'react';
import styled from 'styled-components';
import { CheckmarkCircleFillIconColored } from '../colored-icons/colored-icons';
import { GridArea, GridButton } from './styled-grid-components';

interface Props {
  isSelected: boolean;
  selectJournalpost: (e: React.MouseEvent) => void;
  harTilgangTilArkivvariant: boolean;
  alreadyUsed: boolean;
}

export const SelectDocument = ({ harTilgangTilArkivvariant, isSelected, selectJournalpost, alreadyUsed }: Props) => {
  if (!harTilgangTilArkivvariant) {
    return (
      <StyledWarning>
        <CircleSlashIcon title="Du har ikke tilgang til dette dokumentet" />
      </StyledWarning>
    );
  }

  if (alreadyUsed) {
    return (
      <StyledWarning>
        <ExclamationmarkTriangleIcon title="Dette dokumentet er allerede benyttet i en eksisterende klage eller anke" />
      </StyledWarning>
    );
  }

  const icon = isSelected ? <CheckmarkCircleFillIconColored /> : undefined;
  const buttonText = isSelected ? '' : 'Velg';

  return (
    <GridButton
      size="small"
      variant="tertiary"
      icon={icon}
      onClick={selectJournalpost}
      aria-pressed={isSelected}
      data-testid="select-document"
      $gridArea={GridArea.SELECT}
    >
      {buttonText}
    </GridButton>
  );
};

const StyledWarning = styled.div`
  grid-area: ${GridArea.SELECT};
  display: flex;
  align-items: center;
  justify-content: center;
`;

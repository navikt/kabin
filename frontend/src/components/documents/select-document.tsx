import { SuccessColored, Warning } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
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
        <Warning title="Du har ikke tilgang til dette dokumentet" />
      </StyledWarning>
    );
  }

  if (alreadyUsed) {
    return (
      <StyledWarning>
        <Warning title="Dette dokumentet er allerede benyttet i en eksisterende klage eller anke" />
      </StyledWarning>
    );
  }

  const icon = isSelected ? <SuccessColored title="Valgt" /> : undefined;
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

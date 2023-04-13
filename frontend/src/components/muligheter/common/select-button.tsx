import { CircleSlashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';

interface Props {
  isSelected: boolean;
  select: (e: React.MouseEvent) => void;
  isInvalid: boolean;
}

export const SelectMulighet = ({ isSelected, select: selectAnke, isInvalid }: Props) => {
  const buttonText = isSelected || isInvalid ? '' : 'Velg';

  return (
    <Button
      size="small"
      variant="tertiary"
      icon={getIcon(isSelected, isInvalid)}
      title={getTitle(isSelected, isInvalid)}
      onClick={selectAnke}
      disabled={isInvalid}
      data-testid="select-ankemulighet"
    >
      {buttonText}
    </Button>
  );
};

const getTitle = (isSelected: boolean, isInvalid: boolean) => {
  if (isInvalid) {
    return 'Vedtaksdato kan ikke være etter dato for valgt journalpost';
  }

  if (isSelected) {
    return 'Valgt';
  }

  return '';
};

const getIcon = (isSelected: boolean, isInvalid: boolean) => {
  if (isSelected) {
    return <CheckmarkCircleFillIconColored />;
  }

  if (isInvalid) {
    return <CircleSlashIcon />;
  }

  return undefined;
};

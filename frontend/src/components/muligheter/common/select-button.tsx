import { CircleSlashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';

interface Props {
  isSelected: boolean;
  select: (e: React.MouseEvent) => void;
  isValid: boolean;
}

export const SelectMulighet = ({ isSelected, select, isValid }: Props) => {
  const [icon, buttonText, title] = useButtonProps(isSelected, isValid);

  return (
    <Button
      size="small"
      variant="tertiary"
      icon={icon}
      title={title}
      onClick={select}
      disabled={!isValid}
      data-testid="select-ankemulighet"
    >
      {buttonText}
    </Button>
  );
};

const useButtonProps = (
  isSelected: boolean,
  isValid: boolean,
): [React.ReactNode, undefined, string] | [null, string, undefined] => {
  if (isSelected) {
    return [<CheckmarkCircleFillIconColored key="icon" />, undefined, 'Valgt'];
  }

  if (isValid) {
    return [null, 'Velg', undefined];
  }

  return [
    <CircleSlashIcon key="icon" aria-hidden />,
    undefined,
    'Vedtaksdato kan ikke være etter dato for valgt journalpost',
  ];
};

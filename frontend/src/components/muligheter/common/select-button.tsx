import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { CircleSlashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  isSelected: boolean;
  select: (e: React.MouseEvent) => void;
  isValid: boolean;
  isLoading: boolean;
  mulighetId: string;
}

export const SelectMulighet = ({ isSelected, select, isValid, isLoading, mulighetId }: Props) => {
  const [icon, buttonText, title] = useButtonProps(isSelected, isValid);
  const canEdit = useCanEdit();

  if (!canEdit) {
    return isSelected ? (
      <CheckmarkContainer>
        <ReadOnlyCheckmark aria-label="Valgt" fontSize={20} />{' '}
      </CheckmarkContainer>
    ) : null;
  }

  return (
    <Button
      data-color="neutral"
      size="small"
      variant="tertiary"
      icon={icon}
      title={title}
      onClick={select}
      disabled={!isValid}
      data-testid={`select-mulighet-${mulighetId}`}
      loading={isLoading}
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

const ReadOnlyCheckmark = styled(CheckmarkCircleFillIconColored)`
  align-self: center;
  justify-self: center;
`;

const CheckmarkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

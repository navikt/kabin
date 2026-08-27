import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { getInvalidMulighetDateMessage } from '@app/components/muligheter/common/mulighet-date';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useIsUploadedDocuments } from '@app/hooks/use-journalpost';
import type { IMulighet } from '@app/types/mulighet';
import { CircleSlashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

export interface SelectMulighetProps {
  isSelected: boolean;
  select: (e: React.MouseEvent) => void;
  isValid: boolean;
  isLoading: boolean;
  mulighet: IMulighet;
}

export const SelectMulighet = ({ isSelected, select, isValid, isLoading, mulighet }: SelectMulighetProps) => {
  const [icon, buttonText, title] = useButtonProps(isSelected, isValid, mulighet);
  const canEdit = useCanEdit();

  if (!canEdit) {
    return isSelected ? (
      <div className="flex items-center justify-center">
        <CheckmarkCircleFillIconColored aria-label="Valgt" fontSize={20} className="self-center justify-self-center" />
      </div>
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
      data-testid={`select-mulighet-${mulighet.id}`}
      loading={isLoading}
    >
      {buttonText}
    </Button>
  );
};

const useButtonProps = (
  isSelected: boolean,
  isValid: boolean,
  mulighet: IMulighet,
): [React.ReactNode, undefined, string] | [null, string, undefined] => {
  const isUploadedDocuments = useIsUploadedDocuments();

  if (isSelected) {
    return [<CheckmarkCircleFillIconColored key="icon" />, undefined, 'Valgt'];
  }

  if (isValid) {
    return [null, 'Velg', undefined];
  }

  return [
    <CircleSlashIcon key="icon" aria-hidden />,
    undefined,
    getInvalidMulighetDateMessage(mulighet, isUploadedDocuments),
  ];
};

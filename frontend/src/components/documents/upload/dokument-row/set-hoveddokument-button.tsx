import { ChevronUpDoubleIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

interface Props {
  isHoveddokument: boolean;
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const SetHoveddokumentButton = ({ isHoveddokument, isLoading, onClick, disabled = false }: Props) =>
  isHoveddokument ? null : (
    <Tooltip content="Sett som hoveddokument">
      <Button
        size="xsmall"
        variant="tertiary"
        data-color="brand-blue"
        loading={isLoading}
        onClick={onClick}
        disabled={disabled}
        className="whitespace-nowrap"
        icon={<ChevronUpDoubleIcon aria-hidden />}
      />
    </Tooltip>
  );

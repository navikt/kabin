import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface ExpandButtonProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
  className?: string;
}

export const ExpandButton = ({ isExpanded, toggleExpanded, className }: ExpandButtonProps) => (
  <Button
    data-color="neutral"
    size="small"
    variant="tertiary"
    icon={isExpanded ? <ChevronDownIcon aria-hidden /> : <ChevronRightIcon aria-hidden />}
    onClick={(e) => {
      e.stopPropagation();
      toggleExpanded();
    }}
    onMouseDown={(e) => e.stopPropagation()}
    className={className}
  />
);

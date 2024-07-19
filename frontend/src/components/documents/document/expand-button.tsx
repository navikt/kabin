import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface ExpandButtonProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  className?: string;
}

const ExpandButton = ({ isExpanded, setIsExpanded, className }: ExpandButtonProps) => (
  <Button
    size="small"
    variant="tertiary-neutral"
    icon={isExpanded ? <ChevronDownIcon aria-hidden /> : <ChevronRightIcon aria-hidden />}
    onClick={(e) => {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    }}
    onMouseDown={(e) => e.stopPropagation()}
    className={className}
  />
);

export const StyledExpandButton = styled(ExpandButton)`
  position: absolute;
  left: 0;
  top: 0;
`;

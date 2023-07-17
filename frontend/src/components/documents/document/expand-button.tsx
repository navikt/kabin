import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';

interface ExpandButtonProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  hasVedlegg: boolean;
  className?: string;
}

const ExpandButton = ({ isExpanded, setIsExpanded, hasVedlegg, className }: ExpandButtonProps) => {
  if (!hasVedlegg) {
    return null;
  }

  return (
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
};

export const StyledExpandButton = styled(ExpandButton)`
  position: absolute;
  left: 0;
  top: 0;
`;

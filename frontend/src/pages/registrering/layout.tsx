import { VStack } from '@navikt/ds-react';
import type { ComponentProps, CSSProperties } from 'react';

interface StyledMainProps extends ComponentProps<'main'> {}

export const StyledMain = ({ className = '', style, ...props }: StyledMainProps) => (
  <main
    className={`grid w-full grow content-start items-start justify-start gap-x-0 overflow-x-auto overflow-y-hidden ${className}`}
    style={{
      gridTemplateAreas: "'search search' 'left right'",
      gridTemplateColumns: 'min-content 1fr',
      gridTemplateRows: 'min-content 1fr',
      ...style,
    }}
    {...props}
  />
);

interface ColumnProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export const LeftColumn = ({ className = '', style, ...props }: ColumnProps) => (
  <VStack
    gap="space-16"
    height="100%"
    width="1150px"
    overflowX="auto"
    overflowY="auto"
    paddingBlock="space-8 space-16"
    paddingInline="space-16 space-8"
    className={className}
    style={{ gridArea: 'left', ...style }}
    {...props}
  />
);

export const RightColumn = ({ className = '', style, ...props }: ColumnProps) => (
  <VStack
    gap="space-16"
    height="100%"
    width="100%"
    minWidth="500px"
    maxWidth="1500px"
    overflow="hidden"
    paddingBlock="space-8 space-16"
    paddingInline="space-8 space-16"
    className={className}
    style={{ gridArea: 'right', ...style }}
    {...props}
  />
);

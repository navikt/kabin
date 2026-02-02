import { HStack } from '@navikt/ds-react';
import type { ComponentProps } from 'react';

interface StyledTableProps extends ComponentProps<'table'> {}

export const StyledTable = ({ className = '', style, ...props }: StyledTableProps) => (
  <table className={`w-full ${className}`} style={{ borderSpacing: '16px 0', ...style }} {...props} />
);

interface TableWrapperProps {
  className?: string;
  children?: React.ReactNode;
}

export const TableWrapper = ({ className = '', children, ...props }: TableWrapperProps) => (
  <div className={`rounded border border-ax-accent-300 bg-ax-accent-100 py-4 ${className}`} {...props}>
    {children}
  </div>
);

interface TheadProps extends ComponentProps<'thead'> {}

export const Thead = ({ className = '', ...props }: TheadProps) => (
  <thead className={`whitespace-nowrap text-left ${className}`} {...props} />
);

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export const Header = ({ className = '', children }: HeaderProps) => (
  <HStack justify="space-between" className={className}>
    {children}
  </HStack>
);

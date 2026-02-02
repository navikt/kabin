import { VStack } from '@navikt/ds-react';
import type { ComponentProps } from 'react';

interface ContainerProps extends Omit<ComponentProps<typeof VStack>, 'as'> {}

export const Container = ({ className = '', ...props }: ContainerProps) => (
  <VStack as="section" width="100%" className={className} {...props} />
);

interface TableAndPaginationProps {
  className?: string;
  children?: React.ReactNode;
}

export const TableAndPagination = ({ className = '', ...props }: TableAndPaginationProps) => (
  <VStack gap="space-16" align="center" className={className} {...props} />
);

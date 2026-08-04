import { Box, HStack, Tag } from '@navikt/ds-react';
import { type ComponentProps, forwardRef } from 'react';

interface ReadOnlyTagProps extends ComponentProps<typeof Tag> {
  contentEditable?: boolean;
}

export const ReadOnlyTag = forwardRef<HTMLSpanElement, ReadOnlyTagProps>(({ className = '', ...props }, ref) => (
  <Box asChild borderRadius="12" paddingBlock="space-8" className="truncate text-left">
    <HStack asChild position="relative" maxWidth="100%" justify="start" gap="space-4">
      <Tag ref={ref} className={className} {...props} />
    </HStack>
  </Box>
));

ReadOnlyTag.displayName = 'ReadOnlyTag';

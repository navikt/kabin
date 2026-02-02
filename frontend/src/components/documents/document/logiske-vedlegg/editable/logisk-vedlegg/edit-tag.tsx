import { ReadOnlyTag } from '@app/components/documents/document/logiske-vedlegg/shared/vedlegg-style';
import { type ComponentProps, forwardRef } from 'react';

interface EditTagProps extends ComponentProps<typeof ReadOnlyTag> {}

export const EditTag = forwardRef<HTMLSpanElement, EditTagProps>(({ className = '', ...props }, ref) => (
  <ReadOnlyTag
    ref={ref}
    className={`max-w-50 bg-ax-bg-default empty:before:text-ax-text-neutral-subtle empty:before:content-[attr(aria-placeholder)] [[contenteditable='true']]:cursor-text ${className}`}
    {...props}
  />
));

EditTag.displayName = 'EditTag';

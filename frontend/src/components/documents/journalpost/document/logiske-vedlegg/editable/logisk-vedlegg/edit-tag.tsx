import { ReadOnlyTag } from '@app/components/documents/journalpost/document/logiske-vedlegg/shared/vedlegg-style';
import { type ComponentProps, forwardRef } from 'react';

interface EditTagProps extends ComponentProps<typeof ReadOnlyTag> {}

export const EditTag = forwardRef<HTMLSpanElement, EditTagProps>(({ className = '', ...props }, ref) => (
  <ReadOnlyTag
    ref={ref}
    className={`bg-ax-bg-default empty:before:text-ax-text-neutral-subtle max-w-50 empty:before:content-[attr(aria-placeholder)] [[contenteditable='true']]:cursor-text ${className}`}
    {...props}
  />
));

EditTag.displayName = 'EditTag';

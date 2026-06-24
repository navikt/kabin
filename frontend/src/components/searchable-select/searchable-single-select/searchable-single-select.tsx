import { EditableSelect } from '@app/components/searchable-select/searchable-single-select/editable-select';
import { ReadOnlySelect } from '@app/components/searchable-select/searchable-single-select/read-only-select';
import type { SearchableSelectProps } from '@app/components/searchable-select/searchable-single-select/types';

export type { SearchableSelectProps } from '@app/components/searchable-select/searchable-single-select/types';
export type { Entry } from '@app/components/searchable-select/virtualized-option-list';

export const SearchableSelect = <T,>(props: SearchableSelectProps<T>) => {
  const { readOnly = false } = props;

  if (readOnly) {
    return <ReadOnlySelect {...props} />;
  }

  return <EditableSelect {...props} />;
};

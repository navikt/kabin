import { PartRead, type PartReadProps } from '@app/components/overstyringer/part-read/part-read';
import { PartSearch } from '@app/components/overstyringer/part-write';
import type { BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { useState } from 'react';

export const Part = (props: BaseProps & PartReadProps & { partField: FieldNames.FULLMEKTIG | FieldNames.KLAGER }) => {
  const [isSearchMode, setIsSearchMode] = useState(false);

  if (isSearchMode) {
    return <PartSearch {...props} exitSearchMode={() => setIsSearchMode(false)} />;
  }

  return <PartRead {...props} enterSearchMode={() => setIsSearchMode(true)} />;
};

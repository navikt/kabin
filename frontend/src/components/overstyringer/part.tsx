import { useState } from 'react';
import { PartRead, PartReadProps } from '@app/components/overstyringer/part-read/part-read';
import { PartSearch } from '@app/components/overstyringer/part-write';
import { BaseProps } from '@app/components/overstyringer/types';

export const Part = (props: BaseProps & PartReadProps) => {
  const [isSearchMode, setIsSearchMode] = useState(false);

  if (isSearchMode) {
    return <PartSearch {...props} exitSearchMode={() => setIsSearchMode(false)} />;
  }

  return <PartRead {...props} enterSearchMode={() => setIsSearchMode(true)} />;
};

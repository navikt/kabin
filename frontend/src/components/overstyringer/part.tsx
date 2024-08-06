import { useState } from 'react';
import { BaseProps } from '@app/components/overstyringer/types';
import { PartRead, PartReadProps } from './part-read/part-read';
import { PartSearch } from './part-write';

export const Part = (props: BaseProps & PartReadProps) => {
  const [isSearchMode, setIsSearchMode] = useState(false);

  if (isSearchMode) {
    return <PartSearch {...props} exitSearchMode={() => setIsSearchMode(false)} />;
  }

  return <PartRead {...props} enterSearchMode={() => setIsSearchMode(true)} />;
};

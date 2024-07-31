import { useState } from 'react';
import { BaseProps } from '@app/components/overstyringer/types';
import { PartRead, PartReadProps } from './part-read/part-read';
import { PartWrite } from './part-write';

export const Part = (props: BaseProps & PartReadProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (isEditMode) {
    return <PartWrite {...props} exitEditMode={() => setIsEditMode(false)} />;
  }

  return <PartRead {...props} enterEditMode={() => setIsEditMode(true)} />;
};

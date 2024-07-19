import { useState } from 'react';
import { PartRead, PartReadProps } from './part-read/part-read';
import { PartWrite, PartWriteProps } from './part-write';

export const Part = (props: PartWriteProps & PartReadProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (isEditMode) {
    return <PartWrite {...props} exitEditMode={() => setIsEditMode(false)} />;
  }

  return <PartRead {...props} enterEditMode={() => setIsEditMode(true)} />;
};

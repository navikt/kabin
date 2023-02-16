import React, { useState } from 'react';
import { PartRead } from './part-read';
import { PartWrite, PartWriteProps } from './part-write';

export const Part = (props: PartWriteProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (isEditMode) {
    return <PartWrite {...props} exitEditMode={() => setIsEditMode(false)} />;
  }

  return <PartRead {...props} enterEditMode={() => setIsEditMode(true)} />;
};

import React from 'react';
import { EditButton } from '@app/components/overstyringer/common/edit-button';
import { RemovePartButton } from '@app/components/overstyringer/part-read/remove-part';
import { ResetPartButton } from '@app/components/overstyringer/part-read/reset-part';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import { EnterEditModeCallback, ISetPart } from '@app/components/overstyringer/part-read/types';
import { PartActionsContainer } from '../styled-components';
import { BaseProps } from '../types';

export interface ActionsProps extends BaseProps {
  options?: ISetPart[];
  required?: boolean;
}

export const Actions = ({
  part,
  partField,
  enterEditMode,
  options = [],
  required = true,
}: ActionsProps & EnterEditModeCallback) => (
  <PartActionsContainer>
    {options
      .filter((props) => props.defaultPart !== null)
      .map((props) => (
        <SetPartButton key={props.label} {...props} part={part} partField={partField} />
      ))}
    <ResetPartButton partField={partField} part={part} />
    {required ? null : <RemovePartButton partField={partField} part={part} />}
    <EditButton enterEditMode={enterEditMode} />
  </PartActionsContainer>
);

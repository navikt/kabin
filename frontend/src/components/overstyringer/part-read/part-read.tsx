import { Heading } from '@navikt/ds-react';
import React from 'react';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { EditButton } from '@app/components/overstyringer/common/edit-button';
import { Icon } from '@app/components/overstyringer/part-read/icon';
import { RemovePartButton } from '@app/components/overstyringer/part-read/remove-part';
import { ResetPartButton } from '@app/components/overstyringer/part-read/reset-part';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import { ISetPart } from '@app/components/overstyringer/part-read/types';
import { getSakspartName } from '@app/domain/name';
import {
  PartActionsContainer,
  PartContent,
  PartTextContent,
  StyledContainer,
  StyledPartName,
  getState,
} from '../styled-components';
import { BaseProps } from '../types';

interface Callback {
  enterEditMode?: () => void;
}

export interface PartReadProps extends BaseProps {
  options?: ISetPart[];
  required?: boolean;
}

export const PartRead = ({
  label,
  part,
  partField,
  gridArea,
  enterEditMode,
  icon,
  options = [],
  required = true,
}: PartReadProps & Callback) => (
  <StyledContainer $gridArea={gridArea} $state={getState(part)}>
    {icon}
    <PartContent>
      <PartTextContent>
        <Heading level="3" size="xsmall">
          {label}
        </Heading>
        <CopyPartIdButton part={part} />
        <StyledPartName size="small">
          <Icon type={part?.type ?? null} />
          {getSakspartName(part, null) ?? 'Ingen'}
        </StyledPartName>
      </PartTextContent>

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
    </PartContent>
  </StyledContainer>
);

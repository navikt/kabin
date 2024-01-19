import { Heading } from '@navikt/ds-react';
import React from 'react';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { Icon } from '@app/components/overstyringer/part-read/icon';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { getSakspartName } from '@app/domain/name';
import { PartContent, PartTextContent, StyledContainer, StyledPartName, getState } from '../styled-components';
import { Actions, ActionsProps } from './actions';
import { EnterEditModeCallback } from './types';

export interface PartReadProps extends ActionsProps {
  children?: React.ReactNode;
  error?: string;
}

export const PartRead = ({
  label,
  part,
  icon,
  children,
  partField,
  error,
  ...rest
}: PartReadProps & EnterEditModeCallback) => (
  <StyledContainer $state={getState(part, error)} id={partField}>
    {icon}
    <PartContent>
      <PartTextContent>
        <Heading level="3" size="xsmall">
          {label}
        </Heading>
        <Content part={part}>{children}</Content>
        <ValidationErrorMessage error={error} />
      </PartTextContent>

      <Actions {...rest} part={part} partField={partField} label={label} icon={icon} />
    </PartContent>
  </StyledContainer>
);

const Content = ({ part, children }: Pick<PartReadProps, 'part' | 'children'>) => {
  if (typeof children !== 'undefined') {
    return <>{children}</>;
  }

  if (part === null) {
    return (
      <StyledPartName size="small">
        <Icon />
        Ingen
      </StyledPartName>
    );
  }

  return (
    <>
      <StyledPartName size="small">
        <Icon type={part.type} />
        {getSakspartName(part, null)}
      </StyledPartName>
      <CopyPartIdButton id={part.id} />
      <PartStatusList statusList={part.statusList} />
    </>
  );
};

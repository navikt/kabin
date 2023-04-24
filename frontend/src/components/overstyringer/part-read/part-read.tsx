import { Heading } from '@navikt/ds-react';
import React from 'react';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { Icon } from '@app/components/overstyringer/part-read/icon';
import { getSakspartName } from '@app/domain/name';
import { PartContent, PartTextContent, StyledContainer, StyledPartName, getState } from '../styled-components';
import { Actions, ActionsProps } from './actions';
import { EnterEditModeCallback } from './types';

export interface PartReadProps extends ActionsProps {
  children?: React.ReactNode;
}

export const PartRead = ({ label, part, gridArea, icon, children, ...rest }: PartReadProps & EnterEditModeCallback) => (
  <StyledContainer $gridArea={gridArea} $state={getState(part)}>
    {icon}
    <PartContent>
      <PartTextContent>
        <Heading level="3" size="xsmall">
          {label}
        </Heading>
        <Content part={part}>{children}</Content>
      </PartTextContent>

      <Actions {...rest} part={part} label={label} gridArea={gridArea} icon={icon} />
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
      <CopyPartIdButton part={part} />
      <StyledPartName size="small">
        <Icon type={part.type} />
        {getSakspartName(part, null)}
      </StyledPartName>
    </>
  );
};

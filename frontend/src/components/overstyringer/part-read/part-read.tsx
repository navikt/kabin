import { Heading } from '@navikt/ds-react';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { Icon } from '@app/components/overstyringer/part-read/icon';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { getSakspartName } from '@app/domain/name';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { PartContent, PartTextContent, StyledContainer, StyledPartName, getState } from '../styled-components';
import { Actions, ActionsProps } from './actions';
import { EnterEditModeCallback } from './types';

export interface PartReadProps extends ActionsProps, EnterEditModeCallback {
  // children?: React.ReactNode;
  error?: string;
  id?: string;
}

export const SakenGjelder = (props: Omit<PartReadProps, 'partField'>) => (
  <PartReadInternal {...props} id="sakenGjelder" />
);

export const PartRead = (props: PartReadProps) => {
  const canEdit = useCanEdit();

  return <PartReadInternal {...props}>{canEdit ? <Actions {...props} /> : null}</PartReadInternal>;
};

interface PartReadInternalProps extends Omit<PartReadProps, 'partField'> {
  children?: React.ReactNode;
}

const PartReadInternal = ({
  label,
  part,
  icon,
  children,
  // partField,
  error,
  id,
}: PartReadInternalProps) => (
  <StyledContainer $state={getState(part, error)} id={id}>
    {icon}
    <PartContent>
      <PartTextContent>
        <Heading level="3" size="xsmall">
          {label}
        </Heading>
        <Content part={part} />
        <ValidationErrorMessage error={error} />
      </PartTextContent>

      {children}
      {/* <Actions {...rest} part={part} partField={partField} label={label} icon={icon} /> */}
    </PartContent>
  </StyledContainer>
);

const Content = ({ part }: Pick<PartReadProps, 'part'>) => {
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

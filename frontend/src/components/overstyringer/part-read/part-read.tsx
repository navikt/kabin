import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import {
  getState,
  PartContent,
  PartTextContent,
  StyledContainer,
  StyledPartName,
} from '@app/components/overstyringer/layout';
import { Actions, type ActionsProps } from '@app/components/overstyringer/part-read/actions';
import { Icon } from '@app/components/overstyringer/part-read/icon';
import type { EnterSearchModeCallback } from '@app/components/overstyringer/part-read/types';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { getSakspartName } from '@app/domain/name';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { Heading } from '@navikt/ds-react';

export interface PartReadProps extends ActionsProps, EnterSearchModeCallback {
  error?: string;
  id?: string;
  /** Hides the actions (set/remove/search), so the part can only be changed elsewhere. */
  readOnly?: boolean;
}

export const SakenGjelder = (props: Omit<PartReadProps, 'partField'>) => (
  <PartReadInternal {...props} id="sakenGjelder" />
);

export const PartRead = ({ readOnly, ...rest }: PartReadProps) => {
  const canEdit = useCanEdit();

  return (
    <PartReadInternal {...rest} id={rest.partField}>
      {canEdit && readOnly !== true ? <Actions {...rest} /> : null}
    </PartReadInternal>
  );
};

interface PartReadInternalProps extends Omit<PartReadProps, 'partField'> {
  children?: React.ReactNode;
}

const PartReadInternal = ({ label, part, icon, children, error, id }: PartReadInternalProps) => (
  <StyledContainer state={getState(part, error)} id={id}>
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
      <CopyPartIdButton id={part.identifikator} />
      <PartStatusList statusList={part.statusList} />
    </>
  );
};

import { Buldings2Icon, PersonCrossIcon, PersonIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { CopyToClipboard } from '@navikt/ds-react-internal';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { EditButton } from '@app/components/overstyringer/common/edit-button';
import { getSakspartId, getSakspartName } from '@app/domain/name';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IPart, skipToken } from '@app/types/common';
import { StyledContainer, StyledPartName, getState } from './styled-components';
import { BaseProps, FieldNames } from './types';

interface PartProps {
  part: IPart | null;
}

interface PartReadProps extends BaseProps, PartProps {}

interface Callback {
  enterEditMode?: () => void;
}

export const PartRead = ({ label, part, partField, gridArea, enterEditMode, icon }: PartReadProps & Callback) => (
  <StyledContainer $gridArea={gridArea} $state={getState(part)}>
    {icon}
    <Content>
      <TextContent>
        <Heading level="3" size="xsmall">
          {label}
        </Heading>
        <CopyIdButton part={part} />
        <StyledPartName size="small">
          <Icon part={part} />
          {getSakspartName(part, null) ?? 'Ingen'}
        </StyledPartName>
      </TextContent>

      <Actions>
        <ResetPartButton partField={partField} part={part} />
        <RemoveFullmektigButton partField={partField} part={part} />
        <EditButton enterEditMode={enterEditMode} />
      </Actions>
    </Content>
  </StyledContainer>
);

interface ResetPartButtonProps {
  partField: BaseProps['partField'];
  part: IPart | null;
}

const useDefaultPart = (fieldId: BaseProps['partField']) => {
  const { type, payload } = useContext(ApiContext);

  switch (type) {
    case Type.ANKE:
      return payload.mulighet?.[fieldId] ?? null;
    case Type.KLAGE:
      return null;
    case Type.NONE:
      return skipToken;
  }
};

const ResetPartButton = ({ part, partField }: ResetPartButtonProps) => {
  const { type, updatePayload } = useContext(ApiContext);
  const defaultPart = useDefaultPart(partField);

  if (type === Type.NONE || defaultPart === skipToken || defaultPart === part) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title={`Benytt samme ${partField} som i klagen`}
      onClick={() => updatePayload({ overstyringer: { [partField]: defaultPart } })}
    >
      Fra klagen
    </Button>
  );
};

const RemoveFullmektigButton = ({ partField }: ResetPartButtonProps) => {
  const { type, payload, updatePayload } = useContext(ApiContext);

  if (
    partField !== FieldNames.FULLMEKTIG ||
    type === Type.NONE ||
    (payload.overstyringer?.fullmektig ?? null) === null
  ) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title="Fjern"
      icon={<TrashIcon aria-hidden />}
      onClick={() => updatePayload({ overstyringer: { fullmektig: null } })}
    >
      Fjern
    </Button>
  );
};

const Icon = ({ part }: PartProps) => {
  if (part !== null && part.virksomhet !== null) {
    return <Buldings2Icon aria-hidden />;
  }

  if (part !== null && part.person !== null) {
    return <PersonIcon aria-hidden />;
  }

  return <PersonCrossIcon aria-hidden />;
};

export const CopyIdButton = ({ part }: PartProps) => {
  if (part === null) {
    return null;
  }

  const id = part.person?.foedselsnummer ?? part.virksomhet?.virksomhetsnummer ?? null;

  if (id === null) {
    return null;
  }

  return (
    <StyledCopyButton copyText={id} size="small" title="Kopier" popoverText="Kopiert" iconPosition="right">
      {getSakspartId(part)}
    </StyledCopyButton>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 8px;
  flex-grow: 1;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  flex-grow: 1;
`;

const StyledCopyButton = styled(CopyToClipboard)`
  border: 1px solid var(--a-blue-400);
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  justify-self: end;
  column-gap: 8px;
  flex-shrink: 0;
  flex-grow: 0;
`;

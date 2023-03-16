import { ArrowCirclepathIcon, Buldings2Icon, PencilIcon, PersonIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { CopyToClipboard } from '@navikt/ds-react-internal';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { getSakspartId, getSakspartName } from '../../domain/name';
import { AnkeContext } from '../../pages/create/anke-context';
import { IPart } from '../../types/common';
import { StyledContainer } from './styled-components';
import { BaseProps, GridArea } from './types';

interface PartProps {
  part: IPart | null;
}

interface PartReadProps extends BaseProps, PartProps {}

interface Callback {
  enterEditMode?: () => void;
}

export const PartRead = ({ label, part, gridArea, enterEditMode }: PartReadProps & Callback) => (
  <StyledContainer $gridArea={gridArea} $inactive={part === null}>
    <Icon part={part} />
    <Content>
      <TextContent>
        <Label size="small">{label}</Label>
        <CopyIdButton part={part} />
        <BodyShort size="small">{getSakspartName(part, null) ?? 'Ingen'}</BodyShort>
      </TextContent>
      <Actions>
        <ResetPartButton type={gridArea} part={part} />
        <RemoveFullmektigButton type={gridArea} part={part} />
        <EditButton enterEditMode={enterEditMode} />
      </Actions>
    </Content>
  </StyledContainer>
);

interface EditButtonProps {
  enterEditMode?: () => void;
}

const EditButton = ({ enterEditMode }: EditButtonProps) => {
  if (enterEditMode === undefined) {
    return null;
  }

  return (
    <Button size="small" variant="secondary" icon={<PencilIcon />} title="Endre" onClick={enterEditMode}>
      Endre
    </Button>
  );
};

interface ResetPartButtonProps {
  type: BaseProps['gridArea'];
  part: IPart | null;
}

const ResetPartButton = ({ type, part }: ResetPartButtonProps) => {
  const { ankemulighet, setKlager, setFullmektig } = useContext(AnkeContext);

  if (type === GridArea.SAKEN_GJELDER || ankemulighet === null) {
    return null;
  }

  const isAnker = type === GridArea.ANKER;
  const klagePart = isAnker ? ankemulighet.klager : ankemulighet.fullmektig;

  if (klagePart === part || klagePart === null) {
    return null;
  }

  const setPart = isAnker ? setKlager : setFullmektig;

  return (
    <Button
      size="small"
      variant="secondary"
      title={`Benytt samme ${type} som i klagen`}
      icon={<ArrowCirclepathIcon aria-hidden />}
      onClick={() => setPart(klagePart)}
    >
      Fra klagen
    </Button>
  );
};

const RemoveFullmektigButton = ({ type }: ResetPartButtonProps) => {
  const { fullmektig, setFullmektig } = useContext(AnkeContext);

  if (type !== GridArea.FULLMEKTIG || fullmektig === null) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title="Fjern"
      icon={<XMarkIcon aria-hidden />}
      onClick={() => setFullmektig(null)}
    >
      Fjern
    </Button>
  );
};

const Icon = ({ part }: PartProps) => {
  if (part !== null && part.virksomhet !== null) {
    return <CompanyIcon aria-hidden />;
  }

  return <StyledPersonIcon aria-hidden />;
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

const ICON_SIZE = 24;

const StyledPersonIcon = styled(PersonIcon)`
  align-self: center;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  flex-shrink: 0;
`;

const CompanyIcon = styled(Buldings2Icon)`
  align-self: center;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  flex-shrink: 0;
`;

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
  justify-content: right;
  justify-self: end;
  column-gap: 8px;
  flex-shrink: 0;
  flex-grow: 0;
`;

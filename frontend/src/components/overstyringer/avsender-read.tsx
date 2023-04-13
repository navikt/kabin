import { Buldings2Icon, PersonIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { CopyToClipboard } from '@navikt/ds-react-internal';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { EditButton } from '@app/components/overstyringer/common/edit-button';
import { FullmektigIcon, KlagerIcon, SakenGjelderIcon } from '@app/components/overstyringer/icons';
import { StyledContainer, StyledPartName, getState } from '@app/components/overstyringer/styled-components';
import { GridArea } from '@app/components/overstyringer/types';
import { partToAvsender } from '@app/domain/part-to-avsender';
import { formatId } from '@app/functions/format-id';
import { ValidationFieldNames } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IPart, IdType } from '@app/types/common';
import { IAvsenderMottaker, JournalposttypeEnum } from '@app/types/dokument';

interface Props {
  enterEditMode?: () => void;
  avsender: IAvsenderMottaker | null;
  label: string;
  icon: React.ReactNode;
}

export const AvsenderRead = ({ avsender, label, enterEditMode, icon }: Props) => {
  const { type, journalpost } = useContext(ApiContext);
  const error = useValidationError(ValidationFieldNames.AVSENDER);

  if (type === Type.NONE) {
    return null;
  }

  return (
    <StyledContainer $gridArea={GridArea.AVSENDER} $state={getState(avsender, error)}>
      {icon}
      <Content>
        <TextContent>
          <Heading level="3" size="xsmall">
            {label}
          </Heading>
          <AvsenderContent avsender={avsender} journalposttype={journalpost?.journalposttype} />
        </TextContent>

        <Buttons enterEditMode={enterEditMode} />
      </Content>
    </StyledContainer>
  );
};

interface ButtonsProps {
  enterEditMode?: () => void;
}

const Buttons = ({ enterEditMode }: ButtonsProps) => {
  const { journalpost, payload, type } = useContext(ApiContext);

  if (type === Type.NONE || journalpost === null || journalpost.journalposttype === JournalposttypeEnum.NOTAT) {
    return null;
  }

  return (
    <Actions>
      <SetButton part={payload?.mulighet?.sakenGjelder} label="Saken gjelder" icon={<SakenGjelderIcon aria-hidden />} />
      <SetButton part={payload?.overstyringer.klager} label={getKlagerLabel(type)} icon={<KlagerIcon aria-hidden />} />
      <SetButton part={payload?.overstyringer?.fullmektig} label="Fullmektig" icon={<FullmektigIcon aria-hidden />} />
      <EditButton enterEditMode={enterEditMode} />
    </Actions>
  );
};

interface AvsenderContentProps {
  avsender: IAvsenderMottaker | null;
  journalposttype?: JournalposttypeEnum;
}

const AvsenderContent = ({ avsender, journalposttype }: AvsenderContentProps) => {
  if (avsender === null) {
    if (journalposttype === JournalposttypeEnum.NOTAT) {
      return <BodyShort size="small">Journalposter av type notat har aldri avsender.</BodyShort>;
    }

    return (
      <Alert size="small" variant="warning">
        Avsender av journalpost må settes.
      </Alert>
    );
  }

  return (
    <>
      <StyledCopyButton copyText={avsender.id} size="small" title="Kopier" popoverText="Kopiert" iconPosition="right">
        {formatId(avsender.id)}
      </StyledCopyButton>
      <StyledPartName size="small">
        <Icon part={avsender} />
        {avsender.navn}
      </StyledPartName>
    </>
  );
};

const getKlagerLabel = (type: Type.ANKE | Type.KLAGE) => {
  switch (type) {
    case Type.ANKE:
      return 'Ankende part';
    case Type.KLAGE:
      return 'Klagende part';
  }
};

interface SetButtonProps {
  part?: IPart | null;
  label: string;
  icon: React.ReactNode;
}

const SetButton = ({ part, label, icon }: SetButtonProps) => {
  const { type, updatePayload, payload } = useContext(ApiContext);

  if (
    type === Type.NONE ||
    part === null ||
    typeof part === 'undefined' ||
    payload.overstyringer.avsender?.id === (part.person?.foedselsnummer ?? part.virksomhet?.virksomhetsnummer)
  ) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title={`Sett avsender til samme som ${label.toLocaleLowerCase()}`}
      onClick={() => updatePayload({ overstyringer: { avsender: partToAvsender(part) } })}
      icon={icon}
    >
      {label}
    </Button>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 8px;
  flex-grow: 1;
`;

interface IconProps {
  part: IAvsenderMottaker | null;
}

const Icon = ({ part }: IconProps) => {
  if (part !== null && (part.type === IdType.ORGNR || part.type === IdType.UTL_ORG)) {
    return <Buldings2Icon aria-hidden />;
  }

  return <PersonIcon aria-hidden />;
};

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

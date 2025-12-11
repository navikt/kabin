import { StyledAvsenderIcon } from '@app/components/overstyringer/icons';
import { Part } from '@app/components/overstyringer/part';
import type { ISetPart } from '@app/components/overstyringer/part-read/types';
import { PartContent, States, StyledContainer } from '@app/components/overstyringer/styled-components';
import { FieldNames } from '@app/components/overstyringer/types';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { JournalposttypeEnum } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';
import { Heading, InfoCard } from '@navikt/ds-react';

interface Props {
  options: ISetPart[] | undefined;
}

export const Avsender = ({ options }: Props) => {
  const { overstyringer } = useRegistrering();
  const { avsender } = overstyringer;
  const { journalpost } = useJournalpost();
  const error = useValidationError(ValidationFieldNames.AVSENDER);

  if (journalpost === undefined || journalpost.journalposttype !== JournalposttypeEnum.INNGAAENDE) {
    return null;
  }

  if (!journalpost.canChangeAvsender) {
    return (
      <StyledContainer $state={States.UNSET}>
        <StyledAvsenderIcon aria-hidden />
        <PartContent>
          <Heading level="3" size="xsmall">
            Avsender
          </Heading>
          <InfoCard data-color="info" size="small">
            <InfoCard.Header>
              <InfoCard.Title>Avsender kan ikke endres</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              Avsender kan ikke endres på journalposter som er eldre enn ett år eller som er sendt inn digitalt.
            </InfoCard.Content>
          </InfoCard>
        </PartContent>
      </StyledContainer>
    );
  }

  return (
    <Part
      partField={FieldNames.AVSENDER}
      part={avsender}
      label="Avsender"
      icon={<StyledAvsenderIcon aria-hidden />}
      error={error}
      options={options}
    />
  );
};

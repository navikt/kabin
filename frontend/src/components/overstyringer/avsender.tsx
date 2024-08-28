import { StyledAvsenderIcon } from '@app/components/overstyringer/icons';
import { Part } from '@app/components/overstyringer/part';
import type { ISetPart } from '@app/components/overstyringer/part-read/types';
import { FieldNames } from '@app/components/overstyringer/types';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { JournalposttypeEnum } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';

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

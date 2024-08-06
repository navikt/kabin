import { StyledAvsenderIcon } from '@app/components/overstyringer/icons';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { JournalposttypeEnum } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';
import { Part } from './part';
import { ISetPart } from './part-read/types';
import { FieldNames } from './types';

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

import { FullmektigIcon, KlagerIcon, SakenGjelderIcon, StyledAvsenderIcon } from '@app/components/overstyringer/icons';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { SaksTypeEnum } from '@app/types/common';
import { JournalposttypeEnum } from '@app/types/dokument';
import { ValidationFieldNames } from '@app/types/validation';
import { Part } from './part';
import { FieldNames } from './types';

export const Avsender = () => {
  const { overstyringer } = useRegistrering();
  const { typeId, mulighet } = useMulighet();
  const { journalpost } = useJournalpost();
  const error = useValidationError(ValidationFieldNames.AVSENDER);

  if (typeId === null || mulighet === undefined) {
    return null;
  }

  if (journalpost === undefined || journalpost.journalposttype !== JournalposttypeEnum.INNGAAENDE) {
    return null;
  }

  return (
    <Part
      partField={FieldNames.AVSENDER}
      part={overstyringer.avsender}
      label="Avsender"
      icon={<StyledAvsenderIcon aria-hidden />}
      error={error}
      options={[
        {
          label: 'Saken gjelder',
          defaultPart: mulighet.sakenGjelder,
          title: 'Saken gjelder',
          icon: <SakenGjelderIcon aria-hidden />,
        },
        {
          label: getKlagerLabel(typeId),
          defaultPart: overstyringer.klager,
          title: getKlagerLabel(typeId),
          icon: <KlagerIcon aria-hidden />,
        },
        {
          label: 'Fullmektig',
          defaultPart: overstyringer.fullmektig,
          title: 'Fullmektig',
          icon: <FullmektigIcon aria-hidden />,
        },
      ]}
    />
  );
};

const getKlagerLabel = (type: SaksTypeEnum) => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return 'Ankende part';
    case SaksTypeEnum.KLAGE:
      return 'Klager';
  }
};

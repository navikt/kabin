import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import { BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { avsenderIsPart } from '@app/domain/converters';
import { useJournalpost } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { IPart, SaksTypeEnum } from '@app/types/common';

interface Props {
  partField: BaseProps['partField'];
  part: IPart | null;
}

export const ResetPartButton = ({ part, partField }: Props) => {
  const { typeId } = useRegistrering();
  const defaultPart = useDefaultPart(partField);

  if (typeId === null || defaultPart === null) {
    return null;
  }

  return (
    <SetPartButton
      part={part}
      partField={partField}
      defaultPart={defaultPart}
      label="Fra vedtaket"
      title={`Benytt samme ${partField} som i vedtaket`}
    />
  );
};

const useDefaultPart = (fieldId: BaseProps['partField']): IPart | null => {
  const { journalpost } = useJournalpost();
  const { typeId, mulighet } = useMulighet();

  if (mulighet === undefined) {
    return null;
  }

  if (fieldId === FieldNames.AVSENDER) {
    if (journalpost !== undefined && journalpost.avsenderMottaker !== null) {
      return avsenderIsPart(journalpost.avsenderMottaker) ? journalpost.avsenderMottaker : null;
    }

    return null;
  }

  switch (typeId) {
    case SaksTypeEnum.ANKE: {
      return mulighet[fieldId] ?? null;
    }
    case SaksTypeEnum.KLAGE: {
      return null;
    }
    case null:
      return null;
  }
};

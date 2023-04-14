import React, { useContext } from 'react';
import { SetPartButton } from '@app/components/overstyringer/part-read/set-part';
import { BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { avsenderIsPart } from '@app/domain/converters';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { IPart } from '@app/types/common';

interface Props {
  partField: BaseProps['partField'];
  part: IPart | null;
}

export const ResetPartButton = ({ part, partField }: Props) => {
  const { type } = useContext(ApiContext);
  const defaultPart = useDefaultPart(partField);

  if (type === Type.NONE || defaultPart === null) {
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
  const { type, payload, journalpost } = useContext(ApiContext);

  if (fieldId === FieldNames.AVSENDER) {
    if (journalpost !== null && journalpost.avsenderMottaker !== null) {
      return avsenderIsPart(journalpost.avsenderMottaker) ? journalpost.avsenderMottaker : null;
    }

    return null;
  }

  switch (type) {
    case Type.ANKE: {
      return payload.mulighet?.[fieldId] ?? null;
    }
    case Type.KLAGE: {
      if (fieldId !== FieldNames.SAKEN_GJELDER) {
        return null;
      }

      return payload.mulighet?.[fieldId] ?? null;
    }
    case Type.NONE:
      return null;
  }
};

import { skipToken } from '@reduxjs/toolkit/query/react';
import { useMemo } from 'react';
import { ReceiverType } from '@app/components/svarbrev/type-name';
import { PartReceiver, PartSuggestedReceiver } from '@app/components/svarbrev/types';
import { isNotNull } from '@app/functions/is-not';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetPartWithUtsendingskanalQuery } from '@app/redux/api/part';
import { IPart } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';

export const useSuggestedBrevmottakere = (): (PartSuggestedReceiver | PartReceiver)[] => {
  const { sakenGjelderValue, overstyringer, svarbrev } = useRegistrering();
  const { klager, fullmektig, ytelseId } = overstyringer;
  const { data: sakenGjelder } = useGetPartWithUtsendingskanalQuery(
    sakenGjelderValue === null || ytelseId === null
      ? skipToken
      : { sakenGjelderId: sakenGjelderValue, identifikator: sakenGjelderValue, ytelseId },
  );

  return useMemo(() => {
    if (sakenGjelder === undefined) {
      return [];
    }

    return [
      partToPartRecipient(klager, ReceiverType.KLAGER),
      partToPartRecipient(sakenGjelder, ReceiverType.SAKEN_GJELDER),
      partToPartRecipient(fullmektig, ReceiverType.FULLMEKTIG),
    ]
      .filter(isNotNull)
      .reduce<PartSuggestedReceiver[]>((acc, curr) => {
        const found = acc.find(({ part }) => part.id === curr.part.id);

        if (found === undefined) {
          acc.push(curr);

          return acc;
        }

        found.typeList.push(...curr.typeList);

        return acc;
      }, [])
      .map((sm) => {
        const recipient = svarbrev.receivers.find((m) => m.part.id === sm.part.id);

        return recipient === undefined ? sm : { ...recipient, typeList: sm.typeList };
      });
  }, [fullmektig, klager, sakenGjelder, svarbrev.receivers]);
};

const partToPartRecipient = (part: IPart | null, brevmottakerType: ReceiverType): PartSuggestedReceiver | null => {
  if (part === null) {
    return null;
  }

  return { part, typeList: [brevmottakerType], handling: HandlingEnum.AUTO, overriddenAddress: null };
};

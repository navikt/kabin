import { useContext, useMemo } from 'react';
import { RecipientType } from '@app/components/svarbrev/type-name';
import { isNotNull } from '@app/functions/is-not';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Recipient, Type } from '@app/pages/create/api-context/types';
import { IPart } from '@app/types/common';
import { HandlingEnum } from '@app/types/create';

export interface PartRecipient extends Recipient {
  typeList: RecipientType[];
}

export const useSuggestedBrevmottakere = (): PartRecipient[] => {
  const { type, payload } = useContext(ApiContext);

  return useMemo(() => {
    if (payload === null || payload.mulighet === null || type !== Type.ANKE) {
      return EMPTY_BREVMOTTAKER_LIST;
    }

    const { klager, fullmektig } = payload.overstyringer;
    const { sakenGjelder } = payload.mulighet;
    const receivers = payload.svarbrev?.receivers ?? EMPTY_RECIPIENTS_LIST;

    const suggestedRecipients = [
      partToPartRecipient(klager, RecipientType.KLAGER),
      partToPartRecipient(sakenGjelder, RecipientType.SAKEN_GJELDER),
      partToPartRecipient(fullmektig, RecipientType.FULLMEKTIG),
    ]
      .filter(isNotNull)
      .reduce<PartRecipient[]>((acc, curr) => {
        const found = acc.find(({ part }) => part.id === curr.part.id);

        if (found === undefined) {
          acc.push(curr);

          return acc;
        }

        found.typeList.push(...curr.typeList);

        return acc;
      }, [])
      .map((sm) => {
        const recipient = receivers.find((m) => m.part.id === sm.part.id);

        return recipient === undefined ? sm : { ...recipient, typeList: sm.typeList };
      });

    return suggestedRecipients;
  }, [type, payload]);
};

const EMPTY_RECIPIENTS_LIST: Recipient[] = [];
const EMPTY_BREVMOTTAKER_LIST: PartRecipient[] = [];

const partToPartRecipient = (part: IPart | null, brevmottakerType: RecipientType): PartRecipient | null => {
  if (part === null) {
    return null;
  }

  return { part, typeList: [brevmottakerType], handling: HandlingEnum.AUTO, overriddenAddress: null };
};

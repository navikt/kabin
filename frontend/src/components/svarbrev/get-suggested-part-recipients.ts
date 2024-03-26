import { RecipientType } from '@app/components/svarbrev/type-name';
import { PartRecipient } from '@app/components/svarbrev/types';
import { isNotNull } from '@app/functions/is-not';
import { IAnkeState, Recipient } from '@app/pages/create/app-context/types';
import { IPart } from '@app/types/common';
import { HandlingEnum } from '@app/types/create';

export const getSuggestedBrevmottakere = (state: IAnkeState): PartRecipient[] => {
  if (state.mulighet === null) {
    return EMPTY_BREVMOTTAKER_LIST;
  }

  const { klager, fullmektig } = state.overstyringer;
  const { sakenGjelder } = state.mulighet;
  const receivers = state.svarbrev?.receivers ?? EMPTY_RECIPIENTS_LIST;

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
};

const EMPTY_RECIPIENTS_LIST: Recipient[] = [];
const EMPTY_BREVMOTTAKER_LIST: PartRecipient[] = [];

const partToPartRecipient = (part: IPart | null, brevmottakerType: RecipientType): PartRecipient | null => {
  if (part === null) {
    return null;
  }

  return { part, typeList: [brevmottakerType], handling: HandlingEnum.AUTO, overriddenAddress: null };
};

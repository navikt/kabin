import { Recipient } from '@app/pages/create/app-context/types';
import { IPart } from '@app/types/common';
import { HandlingEnum } from '@app/types/create';

export const partToRecipient = (part: IPart): Recipient => ({
  part,
  handling: HandlingEnum.AUTO,
  overriddenAddress: null,
});

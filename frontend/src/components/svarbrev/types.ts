import { RecipientType } from '@app/components/svarbrev/type-name';
import { Recipient } from '@app/pages/create/app-context/types';

export interface PartRecipient extends Recipient {
  typeList: RecipientType[];
}

import { RecipientType } from '@app/components/svarbrev/type-name';
import { Recipient } from '@app/pages/create/api-context/types';

export interface PartRecipient extends Recipient {
  typeList: RecipientType[];
}

import type { ReceiverType } from '@app/components/svarbrev/type-name';
import type { SuggestedReceiver } from '@app/pages/registrering/app-context/types';
import type { Receiver } from '@app/redux/api/registreringer/types';

export interface PartSuggestedReceiver extends SuggestedReceiver {
  typeList: ReceiverType[];
}

export interface PartReceiver extends Receiver {
  typeList: ReceiverType[];
}

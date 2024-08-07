import { SuggestedReceiver } from '@app/pages/registrering/app-context/types';
import { IAddress } from '@app/types/common';
import { HandlingEnum } from '@app/types/receiver';

export interface SetSendParams {
  id: string;
  send: boolean;
}

export interface AddReceiverParams {
  id: string;
  receiver: SuggestedReceiver;
}

export interface ChangeReceiverParams {
  id: string;
  receiverId: string;
  handling: HandlingEnum;
  overriddenAddress: IAddress | null;
}

export interface RemoveReceiverParams {
  id: string;
  receiverId: string;
}

export interface SetOverrideCustomTextParams {
  id: string;
  overrideCustomText: boolean;
}

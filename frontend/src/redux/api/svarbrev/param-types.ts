import { SuggestedReceiver } from '@app/pages/create/app-context/types';
import { Receiver } from '../registreringer/types';

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
  receiver: Receiver;
}

export interface RemoveReceiverParams {
  id: string;
  receiverId: string;
}

export interface SetOverrideCustomTextParams {
  id: string;
  overrideCustomText: boolean;
}

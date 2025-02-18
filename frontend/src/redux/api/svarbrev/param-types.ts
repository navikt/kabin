import type { SuggestedReceiver } from '@app/pages/registrering/app-context/types';
import type { Behandlingstid } from '@app/redux/api/registreringer/types';
import type { IAddress, SaksTypeEnum } from '@app/types/common';
import type { HandlingEnum } from '@app/types/receiver';

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

export interface SetSvarbrevTitleParams {
  id: string;
  title: string;
}

export type SetSvarbrevBehandlingstidParams = { id: string } & Behandlingstid;

export interface SetOverrideCustomTextParams {
  id: string;
  overrideCustomText: boolean;
}

export interface SetCustomTextParams {
  id: string;
  customText: string;
}

export interface SetSvarbrevOverrideBehandlingstidParams {
  id: string;
  overrideBehandlingstid: boolean;
  typeId: SaksTypeEnum | null;
}

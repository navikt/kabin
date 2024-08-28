import type { Receiver } from '@app/redux/api/registreringer/types';

// TODO: Move to appropriate place.
export interface SuggestedReceiver extends Omit<Receiver, 'id'> {
  id?: string;
}

export const isReceiver = (receiver: SuggestedReceiver): receiver is Receiver => receiver.id !== undefined;

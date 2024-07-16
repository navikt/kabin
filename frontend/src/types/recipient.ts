import { IAddress } from '@app/types/common';

export enum HandlingEnum {
  AUTO = 'AUTO',
  LOCAL_PRINT = 'LOCAL_PRINT',
  CENTRAL_PRINT = 'CENTRAL_PRINT',
}

export interface ApiRecipient {
  id: string;
  handling: HandlingEnum;
  overriddenAddress: IAddress | null;
}

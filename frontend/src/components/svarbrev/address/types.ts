import type { IAddress } from '@app/types/common';

export interface Addresses {
  address: IAddress | null;
  overriddenAddress: IAddress | null;
}

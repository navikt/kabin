import { FinishedRegistrering, MulighetId, Overstyringer, Svarbrev } from '@app/redux/api/registreringer/types';
import { BaseResponse } from '@app/redux/api/types';
import { SaksTypeEnum } from '@app/types/common';

export interface SetTypeResponse extends BaseResponse {
  typeId: SaksTypeEnum | null;
  mulighet: MulighetId;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
}

export interface SetMulighetResponse extends BaseResponse {
  mulighet: MulighetId;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
}

export type FerdigstiltRegistreringResponse = BaseResponse & Pick<FinishedRegistrering, 'finished' | 'behandlingId'>;

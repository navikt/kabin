import { FinishedRegistrering, Overstyringer, Svarbrev } from '@app/redux/api/registreringer/types';
import { BaseResponse } from '@app/redux/api/types';
import { RegistreringType } from '@app/types/common';

export interface SetTypeResponse extends BaseResponse {
  typeId: RegistreringType | null;
  mulighet: string;
  willCreateNewJournalpost: false;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
}

export interface SetMulighetResponse extends BaseResponse {
  mulighet: string;
  willCreateNewJournalpost: boolean;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
}

export type FerdigstiltRegistreringResponse = BaseResponse & Pick<FinishedRegistrering, 'finished' | 'behandlingId'>;

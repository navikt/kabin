import type { FinishedRegistrering, Mulighet, Overstyringer, Svarbrev } from '@app/redux/api/registreringer/types';
import type { BaseResponse } from '@app/redux/api/types';
import type { RegistreringType } from '@app/types/common';

export interface SetTypeResponse extends BaseResponse {
  typeId: RegistreringType | null;
  mulighet: null;
  willCreateNewJournalpost: false;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
}

export interface SetMulighetResponse extends BaseResponse {
  mulighet: Mulighet;
  willCreateNewJournalpost: boolean;
  overstyringer: Overstyringer;
  svarbrev: Svarbrev;
}

export type FerdigstiltRegistreringResponse = BaseResponse & Pick<FinishedRegistrering, 'finished' | 'behandlingId'>;

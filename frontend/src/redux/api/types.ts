import { BaseRegistrering, Overstyringer, Svarbrev } from '@app/redux/api/registreringer/types';

export type BaseResponse = Pick<BaseRegistrering, 'id' | 'modified'>;

export interface OverstyringerResponse<O extends Partial<Overstyringer>>
  extends Pick<BaseRegistrering, 'id' | 'modified'> {
  overstyringer: O;
}

export interface SvarbrevResponse<S extends Partial<Svarbrev>> extends Pick<BaseRegistrering, 'id' | 'modified'> {
  svarbrev: S;
}

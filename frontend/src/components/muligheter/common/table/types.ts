import type {
  IAdditionalKabalMulighet,
  IAnkemulighet,
  IAnkemulighetAfter2027,
  IBegjæringOmGjenopptakMulighet,
  IKlagemulighet,
  IOmgjøringskravmulighet,
} from '@app/types/mulighet';

export enum MulighetType {
  KLAGE = 'KLAGE',
  ANKE = 'ANKE',
  ANKE_AFTER_2027 = 'ANKE_AFTER_2027',
  OMGJØRINGSKRAV = 'OMGJØRINGSKRAV',
  BEGJÆRING_OM_GJENOPPTAK = 'BEGJÆRING_OM_GJENOPPTAK',
  ADDITIONAL_KABAL_MULIGHET = 'ADDITIONAL_KABAL_MULIGHET',
}

/** The mulighet each `MulighetType` renders. Map over it to correlate a `type` with its mulighet,
 * so that narrowing `type` also narrows the mulighet. `ANKE` and `ADDITIONAL_KABAL_MULIGHET` share
 * the same mulighet shape, which is why `MulighetType` - and not `mulighetTypeId` - is the
 * discriminant in the tables. */
export interface MulighetMap {
  [MulighetType.KLAGE]: IKlagemulighet;
  [MulighetType.ANKE]: IAnkemulighet;
  [MulighetType.ANKE_AFTER_2027]: IAnkemulighetAfter2027;
  [MulighetType.OMGJØRINGSKRAV]: IOmgjøringskravmulighet;
  [MulighetType.BEGJÆRING_OM_GJENOPPTAK]: IBegjæringOmGjenopptakMulighet;
  [MulighetType.ADDITIONAL_KABAL_MULIGHET]: IAdditionalKabalMulighet;
}

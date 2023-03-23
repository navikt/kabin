import { Ytelse } from '@app/types/ytelse';
import { IPart, ITilknyttetDokument } from './common';
import { UtfallEnum } from './kodeverk';

export interface IBehandling {
  behandlingId: string;
  ytelseId: Ytelse;
  utfallId: UtfallEnum;
  vedtakDate: string;
  sakenGjelder: IPart;
  klager: IPart;
  fullmektig: IPart | null;
  tilknyttedeDokumenter: ITilknyttetDokument[];
  sakFagsakId: string;
  sakFagsystem: string;
}

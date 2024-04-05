import { partToPartId } from '@app/domain/converters';
import { CaseVedtak } from '@app/types/create';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';

export const mulighetToVedtak = (mulighet: IKlagemulighet | IAnkeMulighet | null): CaseVedtak | null => {
  if (mulighet === null) {
    return null;
  }

  return {
    id: mulighet.id,
    sourceId: mulighet.sourceId,
    sakenGjelder: partToPartId(mulighet.sakenGjelder),
  };
};

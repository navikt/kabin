import { partToPartId } from '@app/domain/converters';
import { defaultString } from '@app/functions/empty-string';
import { DEFAULT_SVARBREV_NAME, Recipient, Svarbrev } from '@app/pages/create/app-context/types';
import { IPart } from '@app/types/common';
import { CaseVedtak, SvarbrevInput } from '@app/types/create';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { ApiRecipient } from '@app/types/recipient';

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

export const getSvarbrevInput = (svarbrev: Svarbrev | null, fullmektig: IPart | null): SvarbrevInput | null => {
  if (svarbrev === null) {
    return null;
  }

  const {
    customText,
    varsletBehandlingstidUnitType,
    varsletBehandlingstidUnits,
    fullmektigFritekst,
    receivers,
    title,
  } = svarbrev;

  if (varsletBehandlingstidUnitType === null || varsletBehandlingstidUnits === null) {
    return null;
  }

  return {
    title: defaultString(title, DEFAULT_SVARBREV_NAME),
    fullmektigFritekst: defaultString(fullmektigFritekst, fullmektig?.name ?? null),
    varsletBehandlingstidUnits,
    varsletBehandlingstidUnitType,
    customText,
    receivers: receivers.map(recipientToApiRecipient),
  };
};

const recipientToApiRecipient = ({ part, ...rest }: Recipient): ApiRecipient => ({ id: part.id, ...rest });

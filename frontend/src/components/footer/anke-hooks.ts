import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createAnke } from '@app/api/api';
import { mulighetToVedtak } from '@app/components/footer/helpers';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { avsenderMottakerToPartId, nullablePartToPartId } from '@app/domain/converters';
import { defaultString } from '@app/functions/empty-string';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { DEFAULT_SVARBREV_NAME, IAnkeState, Recipient, Type, ValidSvarbrev } from '@app/pages/create/app-context/types';
import { useAnkemuligheter } from '@app/simple-api-state/use-api';
import { IPart, skipToken } from '@app/types/common';
import { ApiRecipient, CreateAnkeApiPayload, CreateResponse } from '@app/types/create';
import { IApiValidationResponse, IValidationSection } from '@app/types/validation';
import { IApiErrorReponse, isApiError, isValidationResponse } from './error-type-guard';

const getAnkeApiPayload = (
  state: IAnkeState,
  svarbrev: ValidSvarbrev | null,
  journalpostId: string,
): CreateAnkeApiPayload => {
  const { mulighet, overstyringer } = state;

  const {
    ytelseId,
    mottattKlageinstans,
    fristInWeeks,
    klager,
    fullmektig,
    avsender,
    saksbehandlerIdent,
    hjemmelIdList,
  } = overstyringer;

  const vedtak = mulighetToVedtak(mulighet);

  return {
    vedtak,
    mottattKlageinstans,
    fristInWeeks,
    klager: nullablePartToPartId(klager),
    fullmektig: nullablePartToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsender),
    journalpostId,
    ytelseId,
    hjemmelIdList,
    saksbehandlerIdent,
    svarbrevInput: getSvarbrevInput(svarbrev, fullmektig),
  };
};

const getSvarbrevInput = (
  svarbrev: ValidSvarbrev | null,
  fullmektig: IPart | null,
): CreateAnkeApiPayload['svarbrevInput'] => {
  if (svarbrev === null) {
    return null;
  }

  const { title, receivers, fullmektigFritekst } = svarbrev;

  return {
    title: defaultString(title, DEFAULT_SVARBREV_NAME),
    fullmektigFritekst: defaultString(fullmektigFritekst, fullmektig?.name ?? null),
    receivers: receivers.map(recipientToApiRecipient),
  };
};

const recipientToApiRecipient = ({ part, ...rest }: Recipient): ApiRecipient => ({ id: part.id, ...rest });

export const useCreateAnke = (
  setError: (error: IApiValidationResponse | IApiErrorReponse | IValidationSection | Error | undefined) => void,
) => {
  const { type, fnr, setErrors, state, journalpost } = useContext(AppContext);

  const navigate = useNavigate();
  const { updateData: updateAnkemuligheter } = useAnkemuligheter(type === Type.ANKE ? fnr : skipToken);

  return useCallback(async () => {
    if (journalpost === null || type !== Type.ANKE) {
      return;
    }

    const { svarbrev, sendSvarbrev } = state;

    const createAnkePayload = getAnkeApiPayload(state, sendSvarbrev ? svarbrev : null, journalpost.journalpostId);

    try {
      const res = await createAnke(createAnkePayload);

      if (res.ok) {
        updateAnkemuligheter((data) => data?.filter((d) => d.id !== createAnkePayload.vedtak?.id));

        setError(undefined);

        const json = (await res.json()) as CreateResponse;

        navigate(`/anke/${json.behandlingId}/status`);
      } else {
        const json: unknown = await res.json();

        if (res.status !== 400) {
          errorToast(json);
        }

        if (isApiError(json)) {
          setError(json);
        } else if (isValidationResponse(json)) {
          setError(json);
          setErrors(json.sections);
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        toast({ type: ToastType.ERROR, message: `Feil ved oppretting av anke: ${e.message}` });
        setError(e);
      }
    }
  }, [journalpost, type, state, setErrors, updateAnkemuligheter, setError, navigate]);
};

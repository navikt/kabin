import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createAnke } from '@app/api/api';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { avsenderMottakerToPartId, partToPartId } from '@app/domain/converters';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { IAnkeState, Type } from '@app/pages/create/api-context/types';
import { useAnkemuligheter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { CreateAnkeApiPayload, CreateResponse } from '@app/types/create';
import { IApiValidationResponse } from '@app/types/validation';
import { IApiErrorReponse, isApiError, isValidationResponse } from './error-type-guard';

const getAnkeApiPayload = (payload: IAnkeState, journalpostId: string): CreateAnkeApiPayload => {
  if (payload.mulighet === null) {
    throw new Error('Mulighet er ikke satt.');
  }

  const {
    mottattKlageinstans,
    fristInWeeks,
    klager,
    fullmektig,
    avsender: avsenderMottaker,
    saksbehandlerIdent,
  } = payload.overstyringer;

  const { id, sourceId } = payload.mulighet;

  return {
    id,
    mottattKlageinstans,
    fristInWeeks,
    klager: partToPartId(klager),
    fullmektig: partToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsenderMottaker),
    journalpostId,
    ytelseId: payload.overstyringer.ytelseId,
    hjemmelIdList: payload.overstyringer.hjemmelIdList,
    saksbehandlerIdent,
    sourceId,
  };
};

export const useCreateAnke = (
  setError: (error: IApiValidationResponse | IApiErrorReponse | Error | undefined) => void,
) => {
  const { type, fnr, setErrors, payload, journalpost } = useContext(ApiContext);

  const navigate = useNavigate();
  const { updateData: updateAnkemuligheter } = useAnkemuligheter(type === Type.ANKE ? fnr : skipToken);

  return useCallback(async () => {
    if (journalpost === null || type !== Type.ANKE) {
      return;
    }

    try {
      const createAnkePayload = getAnkeApiPayload(payload, journalpost.journalpostId);

      const res = await createAnke(createAnkePayload);

      if (res.ok) {
        updateAnkemuligheter((data) => data?.filter((d) => d.id !== createAnkePayload.id));

        setError(undefined);

        const json = (await res.json()) as CreateResponse;

        navigate(`/anke/${json.mottakId}/status`);
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
  }, [payload, journalpost, navigate, setError, setErrors, type, updateAnkemuligheter]);
};

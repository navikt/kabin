import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { createKlage } from '@app/api/api';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { avsenderMottakerToPartId, partToPartId } from '@app/domain/converters';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useKlagemuligheter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { CreateKlageApiPayload, CreateResponse } from '@app/types/create';
import { IApiErrorReponse, IApiValidationResponse, isApiError, isValidationResponse } from './error-type-guard';

const useKlageApiPayload = (): CreateKlageApiPayload | null => {
  const { payload, type, journalpost } = useContext(ApiContext);

  if (type !== Type.KLAGE || payload.mulighet === null || journalpost === null) {
    return null;
  }

  const {
    mottattKlageinstans,
    mottattVedtaksinstans,
    fristInWeeks,
    klager,
    fullmektig,
    avsender: avsenderMottaker,
  } = payload.overstyringer;

  if (
    mottattKlageinstans === null ||
    mottattVedtaksinstans === null ||
    fristInWeeks === null ||
    payload.overstyringer.ytelseId === null
  ) {
    return null;
  }

  return {
    sakId: payload.mulighet.sakId,
    mottattKlageinstans,
    mottattVedtaksinstans,
    fristInWeeks,
    klager: partToPartId(klager),
    fullmektig: partToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsenderMottaker),
    klageJournalpostId: journalpost.journalpostId,
    hjemmelIdList: payload.overstyringer.hjemmelIdList,
    ytelseId: payload.overstyringer.ytelseId,
  };
};

export const useCreateKlage = (
  setError: (error: IApiValidationResponse | IApiErrorReponse | Error | undefined) => void
) => {
  const { type, fnr, setErrors } = useContext(ApiContext);
  const payload = useKlageApiPayload();

  const navigate = useNavigate();
  const { updateData } = useKlagemuligheter(type === Type.KLAGE ? fnr : skipToken);

  return async () => {
    if (payload === null || type !== Type.KLAGE) {
      return;
    }

    try {
      const res = await createKlage(payload);

      if (res.ok) {
        updateData((data) => data?.filter((d) => d.sakId !== payload.sakId));

        setError(undefined);

        const json = (await res.json()) as CreateResponse;

        navigate(`/klage/${json.mottakId}/status`);
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
        toast({ type: ToastType.ERROR, message: `Feil ved oppretting av klage: ${e.message}` });

        setError(e);
      }
    }
  };
};

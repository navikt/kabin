import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { createKlage } from '@app/api/api';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { avsenderMottakerToPartId } from '@app/domain/converters';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { useKlagemuligheter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { CreateKlageApiPayload, CreateResponse } from '@app/types/create';
import { IApiErrorReponse, IApiValidationResponse, isApiError, isValidationResponse } from './error-type-guard';
import { getPartId } from './part-id';

const useKlageApiPayload = (): CreateKlageApiPayload | null => {
  const { payload, type, journalpost } = useContext(ApiContext);

  if (type !== Type.KLAGE || payload.mulighet === null || journalpost === null) {
    return null;
  }

  const { mottattNav, fristInWeeks, klager, fullmektig, avsender: avsenderMottaker } = payload.overstyringer;

  if (mottattNav === null || fristInWeeks === null) {
    return null;
  }

  return {
    saksId: payload.mulighet.sakId,
    mottattNav,
    fristInWeeks,
    klager: getPartId(klager),
    fullmektig: getPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsenderMottaker),
    klageDocumentJournalpostId: journalpost.journalpostId,
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
        updateData((data) => data?.filter((d) => d.sakId !== payload.saksId));

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

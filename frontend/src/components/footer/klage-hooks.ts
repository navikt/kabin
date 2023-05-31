import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createKlage } from '@app/api/api';
import { IApiErrorReponse, isApiError, isValidationResponse } from '@app/components/footer/error-type-guard';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { avsenderMottakerToPartId, partToPartId } from '@app/domain/converters';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { IKlageState, Type } from '@app/pages/create/api-context/types';
import { useKlagemuligheter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { CreateKlageApiPayload, CreateResponse } from '@app/types/create';
import { IApiValidationResponse } from '@app/types/validation';

const getKlageApiPayload = (payload: IKlageState, journalpostId: string): CreateKlageApiPayload => {
  const {
    mottattKlageinstans,
    mottattVedtaksinstans,
    fristInWeeks,
    klager,
    fullmektig,
    avsender: avsenderMottaker,
    saksbehandlerIdent,
  } = payload.overstyringer;

  return {
    behandlingId: payload.mulighet === null ? null : payload.mulighet.behandlingId,
    mottattKlageinstans,
    mottattVedtaksinstans,
    fristInWeeks,
    klager: partToPartId(klager),
    fullmektig: partToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsenderMottaker),
    journalpostId,
    hjemmelIdList: payload.overstyringer.hjemmelIdList,
    ytelseId: payload.overstyringer.ytelseId,
    saksbehandlerIdent,
  };
};

export const useCreateKlage = (
  setError: (error: IApiValidationResponse | IApiErrorReponse | Error | undefined) => void
) => {
  const { type, fnr, setErrors, journalpost, payload } = useContext(ApiContext);

  const navigate = useNavigate();
  const { updateData } = useKlagemuligheter(type === Type.KLAGE ? fnr : skipToken);

  return useCallback(async () => {
    if (journalpost === null || type !== Type.KLAGE) {
      return;
    }

    const createKlagePayload = getKlageApiPayload(payload, journalpost.journalpostId);

    try {
      const res = await createKlage(createKlagePayload);

      if (res.ok) {
        updateData((data) => data?.filter((d) => d.behandlingId !== createKlagePayload.behandlingId));

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
  }, [journalpost, navigate, payload, setError, setErrors, type, updateData]);
};

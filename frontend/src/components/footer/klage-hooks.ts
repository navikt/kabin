import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createKlage } from '@app/api/api';
import { IApiErrorReponse, isApiError, isValidationResponse } from '@app/components/footer/error-type-guard';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { avsenderMottakerToPartId, partToPartId } from '@app/domain/converters';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { IKlageState, Type } from '@app/pages/create/app-context/types';
import { useKlagemuligheter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { CreateKlageApiPayload, CreateResponse } from '@app/types/create';
import { IApiValidationResponse } from '@app/types/validation';

const getKlageApiPayload = (state: IKlageState, journalpostId: string): CreateKlageApiPayload => {
  const {
    mottattKlageinstans,
    mottattVedtaksinstans,
    fristInWeeks,
    klager,
    fullmektig,
    avsender: avsenderMottaker,
    saksbehandlerIdent,
  } = state.overstyringer;

  return {
    id: state.mulighet === null ? null : state.mulighet.behandlingId,
    mottattKlageinstans,
    mottattVedtaksinstans,
    fristInWeeks,
    klager: partToPartId(klager),
    fullmektig: partToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsenderMottaker),
    journalpostId,
    ytelseId: state.overstyringer.ytelseId,
    hjemmelIdList: state.overstyringer.hjemmelIdList,
    saksbehandlerIdent,
  };
};

export const useCreateKlage = (
  setError: (error: IApiValidationResponse | IApiErrorReponse | Error | undefined) => void,
) => {
  const { type, fnr, setErrors, journalpost, state } = useContext(AppContext);

  const navigate = useNavigate();
  const { updateData } = useKlagemuligheter(type === Type.KLAGE ? fnr : skipToken);

  return useCallback(async () => {
    if (journalpost === null || type !== Type.KLAGE) {
      return;
    }

    const createKlagePayload = getKlageApiPayload(state, journalpost.journalpostId);

    try {
      const res = await createKlage(createKlagePayload);

      if (res.ok) {
        updateData((data) => data?.filter((d) => d.behandlingId !== createKlagePayload.id));

        setError(undefined);

        const json = (await res.json()) as CreateResponse;

        navigate(`/klage/${json.behandlingId}/status`);
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
  }, [journalpost, navigate, state, setError, setErrors, type, updateData]);
};

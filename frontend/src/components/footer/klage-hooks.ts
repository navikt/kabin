import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createKlage } from '@app/api/api';
import { IApiErrorReponse, isApiError, isValidationResponse } from '@app/components/footer/error-type-guard';
import { getSvarbrevInput, mulighetToVedtak } from '@app/components/footer/helpers';
import { oppgaverIsEnabled } from '@app/components/oppgaver/hooks';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { avsenderMottakerToPartId, nullablePartToPartId } from '@app/domain/converters';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { IKlageState, Svarbrev, Type } from '@app/pages/create/app-context/types';
import { useKlagemuligheter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { CreateKlageApiPayload, CreateResponse } from '@app/types/create';
import { IApiValidationResponse, IValidationError, SectionNames, ValidationFieldNames } from '@app/types/validation';

const getKlageApiPayload = (
  state: IKlageState,
  svarbrev: Svarbrev | null,
  journalpostId: string,
): CreateKlageApiPayload => {
  const { mulighet, overstyringer } = state;

  const {
    mottattKlageinstans,
    mottattVedtaksinstans,
    klager,
    fullmektig,
    avsender: avsenderMottaker,
    saksbehandlerIdent,
    oppgaveId,
    behandlingstidUnitType,
    behandlingstidUnits,
  } = overstyringer;

  const vedtak = mulighetToVedtak(mulighet);

  return {
    vedtak,
    mottattKlageinstans,
    mottattVedtaksinstans,
    behandlingstidUnitType,
    behandlingstidUnits,
    klager: nullablePartToPartId(klager),
    fullmektig: nullablePartToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsenderMottaker),
    journalpostId,
    ytelseId: overstyringer.ytelseId,
    hjemmelIdList: overstyringer.hjemmelIdList,
    saksbehandlerIdent,
    oppgaveId,
    svarbrevInput: getSvarbrevInput(svarbrev, fullmektig),
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

    // TODO: Remove when API validates Gosys-oppgave.
    if (oppgaverIsEnabled(type, state) && state.overstyringer.oppgaveId === null) {
      const oppgaveError: IValidationError = {
        field: ValidationFieldNames.OPPGAVE,
        reason: 'Velg en Gosys-oppgave.',
      };

      setError({
        type: 'validation',
        status: 400,
        title: 'Valideringsfeil',
        detail: 'Valideringsfeil',
        sections: [{ section: SectionNames.SAKSDATA, properties: [oppgaveError] }],
      });

      setErrors([
        {
          section: SectionNames.SAKSDATA,
          properties: [oppgaveError],
        },
      ]);

      return;
    }

    const { sendSvarbrev, svarbrev } = state;

    const createKlagePayload = getKlageApiPayload(state, sendSvarbrev ? svarbrev : null, journalpost.journalpostId);

    try {
      const res = await createKlage(createKlagePayload);

      if (res.ok) {
        updateData((data) => data?.filter((d) => d.id !== createKlagePayload.vedtak?.id));

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

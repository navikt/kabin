import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createAnke } from '@app/api/api';
import { getSvarbrevInput, mulighetToVedtak } from '@app/components/footer/helpers';
import { oppgaverIsEnabled } from '@app/components/oppgaver/hooks';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { avsenderMottakerToPartId, nullablePartToPartId } from '@app/domain/converters';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { IAnkeState, Svarbrev, Type } from '@app/pages/create/app-context/types';
import { useAnkemuligheter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { CreateAnkeApiPayload, CreateResponse } from '@app/types/create';
import {
  IApiValidationResponse,
  IValidationError,
  IValidationSection,
  SectionNames,
  ValidationFieldNames,
} from '@app/types/validation';
import { IApiErrorReponse, isApiError, isValidationResponse } from './error-type-guard';

const getAnkeApiPayload = (
  state: IAnkeState,
  svarbrev: Svarbrev | null,
  journalpostId: string,
): CreateAnkeApiPayload => {
  const { mulighet, overstyringer } = state;

  const {
    ytelseId,
    mottattKlageinstans,
    klager,
    fullmektig,
    avsender,
    saksbehandlerIdent,
    hjemmelIdList,
    oppgaveId,
    behandlingstidUnitType,
    behandlingstidUnits,
  } = overstyringer;

  const vedtak = mulighetToVedtak(mulighet);

  return {
    vedtak,
    mottattKlageinstans,
    behandlingstidUnits,
    behandlingstidUnitType,
    klager: nullablePartToPartId(klager),
    fullmektig: nullablePartToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsender),
    journalpostId,
    ytelseId,
    hjemmelIdList,
    saksbehandlerIdent,
    oppgaveId,
    svarbrevInput: getSvarbrevInput(svarbrev, fullmektig),
  };
};

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
        toast.error(`Feil ved oppretting av anke: ${e.message}`);
        setError(e);
      }
    }
  }, [journalpost, type, state, setErrors, updateAnkemuligheter, setError, navigate]);
};

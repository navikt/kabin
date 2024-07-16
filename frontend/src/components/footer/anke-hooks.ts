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
import { DEFAULT_SVARBREV_NAME, IAnkeState, Recipient, Svarbrev, Type } from '@app/pages/create/app-context/types';
import { useAnkemuligheter } from '@app/simple-api-state/use-api';
import { IPart, SaksTypeEnum, skipToken } from '@app/types/common';
import { CreateAnkeApiPayload, CreateResponse } from '@app/types/create';
import { ApiRecipient } from '@app/types/recipient';
import { IApiValidationResponse, IValidationSection } from '@app/types/validation';
import { IApiErrorReponse, isApiError, isValidationResponse } from './error-type-guard';

const getAnkeApiPayload = (
  state: IAnkeState,
  svarbrev: Svarbrev | null,
  journalpostId: string,
): CreateAnkeApiPayload => {
  const { mulighet, overstyringer } = state;

  const { ytelseId, mottattKlageinstans, klager, fullmektig, avsender, saksbehandlerIdent, hjemmelIdList, oppgaveId } =
    overstyringer;

  const vedtak = mulighetToVedtak(mulighet);

  return {
    vedtak,
    mottattKlageinstans,
    varsletBehandlingstidUnits: svarbrev?.varsletBehandlingstidUnits ?? null,
    varsletBehandlingstidUnitType: svarbrev?.varsletBehandlingstidUnitType ?? null,
    klager: nullablePartToPartId(klager),
    fullmektig: nullablePartToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsender),
    journalpostId,
    ytelseId,
    hjemmelIdList,
    saksbehandlerIdent,
    svarbrevInput: getSvarbrevInput(
      svarbrev,
      fullmektig,
      klager,
      mulighet?.sakenGjelder ?? null,
      mottattKlageinstans,
      ytelseId,
    ),
    oppgaveId,
  };
};

const getSvarbrevInput = (
  svarbrev: Svarbrev | null,
  fullmektig: IPart | null,
  klager: IPart | null,
  sakenGjelder: IPart | null,
  mottattKlageinstans: string | null,
  ytelseId: string | null,
): CreateAnkeApiPayload['svarbrevInput'] => {
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

  return {
    varsletBehandlingstidUnits,
    varsletBehandlingstidUnitType,
    title: defaultString(title, DEFAULT_SVARBREV_NAME),
    fullmektigFritekst: defaultString(fullmektigFritekst, fullmektig?.name ?? null),
    receivers: receivers.map(recipientToApiRecipient),
    typeId: SaksTypeEnum.ANKE,
    customText,
    klager: klager?.id ?? null,
    sakenGjelder: sakenGjelder?.id ?? null,
    mottattKlageinstans,
    ytelseId,
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

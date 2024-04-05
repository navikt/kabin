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
import { getValidSvarbrev } from '@app/pages/create/app-context/helpers';
import {
  DEFAULT_SVARBREV_NAME,
  IAnkeOverstyringer,
  Recipient,
  Type,
  ValidSvarbrev,
} from '@app/pages/create/app-context/types';
import { useAnkemuligheter } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { ApiRecipient, CreateAnkeApiPayload, CreateResponse } from '@app/types/create';
import { IAnkeMulighet } from '@app/types/mulighet';
import { IApiValidationResponse, IValidationSection, SectionNames, ValidationFieldNames } from '@app/types/validation';
import { IApiErrorReponse, isApiError, isValidationResponse } from './error-type-guard';

const getAnkeApiPayload = (
  mulighet: IAnkeMulighet | null,
  overstyringer: IAnkeOverstyringer,
  svarbrev: ValidSvarbrev,
  journalpostId: string,
): CreateAnkeApiPayload => {
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
  const { title, enhetId, fullmektigFritekst, receivers } = svarbrev;

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
    svarbrevInput: {
      title: defaultString(title, DEFAULT_SVARBREV_NAME),
      enhetId,
      fullmektigFritekst: defaultString(fullmektigFritekst, overstyringer.fullmektig?.name ?? null),
      receivers: receivers.map(recipientToApiRecipient),
    },
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

    const { mulighet, overstyringer, svarbrev } = state;

    if (!getValidSvarbrev(svarbrev)) {
      setErrors([
        {
          section: SectionNames.SVARBREV,
          properties: [
            {
              reason: 'Enhet for svarbrev er ikke satt.',
              field: ValidationFieldNames.ENHET,
            },
          ],
        },
      ]);

      return;
    }

    const createAnkePayload = getAnkeApiPayload(mulighet, overstyringer, svarbrev, journalpost.journalpostId);

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
  }, [state, journalpost, navigate, setError, setErrors, type, updateAnkemuligheter]);
};

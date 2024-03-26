import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createAnke } from '@app/api/api';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { avsenderMottakerToPartId, partToPartId } from '@app/domain/converters';
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
  mulighet: IAnkeMulighet,
  overstyringer: IAnkeOverstyringer,
  svarbrev: ValidSvarbrev,
  journalpostId: string,
): CreateAnkeApiPayload => {
  const { id, sourceId, sakenGjelder } = mulighet;
  const {
    mottattKlageinstans,
    fristInWeeks,
    klager,
    fullmektig,
    avsender,
    saksbehandlerIdent,
    ytelseId,
    hjemmelIdList,
  } = overstyringer;
  const { title, enhetId, fullmektigFritekst, receivers } = svarbrev;

  return {
    id,
    mottattKlageinstans,
    fristInWeeks,
    sakenGjelder: {
      id: sakenGjelder.id,
      type: sakenGjelder.type,
    },
    klager: partToPartId(klager),
    fullmektig: partToPartId(fullmektig),
    avsender: avsenderMottakerToPartId(avsender),
    journalpostId,
    ytelseId,
    hjemmelIdList,
    saksbehandlerIdent,
    sourceId,
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

    try {
      const { mulighet, overstyringer, svarbrev } = state;

      if (mulighet === null) {
        const saksdataSection: IValidationSection = {
          properties: [
            {
              reason: 'Mulighet er ikke satt.',
              field: ValidationFieldNames.MULIGHET,
            },
          ],
          section: SectionNames.SAKSDATA,
        };

        setErrors((e) => (e === null ? [saksdataSection] : [...e, saksdataSection]));
        setError(new Error('Mulighet er ikke satt.'));

        return;
      }

      if (!getValidSvarbrev(svarbrev)) {
        const svarbrevSection: IValidationSection = {
          properties: [
            {
              reason: 'Enhet for svarbrev er ikke satt.',
              field: ValidationFieldNames.ENHET,
            },
          ],
          section: SectionNames.SVARBREV,
        };

        setErrors((e) => (e === null ? [svarbrevSection] : [...e, svarbrevSection]));
        setError(new Error('Enhet for svarbrev er ikke satt.'));

        return;
      }

      const createAnkePayload = getAnkeApiPayload(mulighet, overstyringer, svarbrev, journalpost.journalpostId);

      const res = await createAnke(createAnkePayload);

      if (res.ok) {
        updateAnkemuligheter((data) => data?.filter((d) => d.id !== createAnkePayload.id));

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

import { useContext, useState } from 'react';
import { addLogiskVedlegg, removeLogiskVedlegg, updateLogiskVedlegg } from '@app/api/api';
import { isApiError, isValidationResponse } from '@app/components/footer/error-type-guard';
import { errorToast } from '@app/components/toast/error-toast';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { useDokumenter } from '@app/simple-api-state/use-api';
import { IArkivertDocument, LogiskVedlegg } from '@app/types/dokument';

interface BaseProps {
  error?: string;
  isLoading: boolean;
}

type AddLogiskVedlegg = [(tittel: string) => Promise<LogiskVedlegg | undefined>, BaseProps];
type UpdateLogiskVedlegg = [(logiskVedlegg: LogiskVedlegg) => Promise<LogiskVedlegg | undefined>, BaseProps];
type DeleteLogiskVedlegg = [(logiskVedleggId: string) => Promise<void>, BaseProps];

export const useAddLogiskVedlegg = (dokumentInfoId: string): AddLogiskVedlegg => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateData = useUpdateDocuments(dokumentInfoId);

  const add = async (tittel: string) => {
    setError(undefined);

    const fakeId = crypto.randomUUID();

    const undo = updateData((logiskeVedlegg) => logiskeVedlegg.concat({ tittel, logiskVedleggId: fakeId }));

    try {
      setIsLoading(true);
      const res = await addLogiskVedlegg({ dokumentInfoId, tittel });

      if (res.ok) {
        const json = (await res.json()) as LogiskVedlegg;

        updateData((logiskeVedlegg) => logiskeVedlegg.filter((l) => l.logiskVedleggId !== fakeId).concat(json));

        return json;
      }

      handleNotOk(res, setError);
    } catch (e) {
      undo();

      if (e instanceof Error) {
        const message = `Feil ved oppretting av logisk vedlegg: ${e.message}`;
        toast({ type: ToastType.ERROR, message });
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return [add, { error, isLoading }];
};

export const useUpdateLogiskVedlegg = (dokumentInfoId: string): UpdateLogiskVedlegg => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateData = useUpdateDocuments(dokumentInfoId);

  const update = async (logiskVedlegg: LogiskVedlegg) => {
    setError(undefined);

    const undo = updateData((lv) =>
      lv.map((l) => (l.logiskVedleggId === logiskVedlegg.logiskVedleggId ? { ...l, tittel: logiskVedlegg.tittel } : l)),
    );

    try {
      setIsLoading(true);
      const res = await updateLogiskVedlegg({ dokumentInfoId, ...logiskVedlegg });

      if (res.ok) {
        const json = (await res.json()) as LogiskVedlegg;

        return json;
      }

      handleNotOk(res, setError);
    } catch (e) {
      undo();

      if (e instanceof Error) {
        const message = `Feil ved oppretting av logisk vedlegg: ${e.message}`;
        toast({ type: ToastType.ERROR, message });
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return [update, { error, isLoading }];
};

export const useDeleteLogiskVedlegg = (dokumentInfoId: string): DeleteLogiskVedlegg => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateData = useUpdateDocuments(dokumentInfoId);

  const remove = async (logiskVedleggId: string) => {
    setError(undefined);

    const undo = updateData((logiskeVedlegg) => logiskeVedlegg.filter((l) => l.logiskVedleggId !== logiskVedleggId));

    try {
      setIsLoading(true);
      const res = await removeLogiskVedlegg({ dokumentInfoId, logiskVedleggId });

      if (res.ok) {
        return;
      }

      handleNotOk(res, setError);
    } catch (e) {
      undo();

      if (e instanceof Error) {
        const message = `Feil ved sletting av logisk vedlegg: ${e.message}`;
        toast({ type: ToastType.ERROR, message });
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return [remove, { error, isLoading }];
};

const handleNotOk = async (res: Response, setError: (e: string) => void) => {
  const json: unknown = await res.json();

  if (res.status !== 400) {
    errorToast(json);
  }

  if (isApiError(json)) {
    setError(json.title + json.detail);
  } else if (isValidationResponse(json)) {
    setError(json.title);
  }
};

type UpdateLogiskeVedlegg = (logiskeVedlegg: LogiskVedlegg[]) => LogiskVedlegg[];

const useUpdateDocuments = (dokumentInfoId: string) => {
  const { fnr } = useContext(AppContext);
  const { data, updateData } = useDokumenter(fnr);

  return (updateLogiskeVedlegg: UpdateLogiskeVedlegg) => {
    const originalData = structuredClone(data);

    updateData((d) => {
      if (d === undefined) {
        return undefined;
      }

      const dokumenter: IArkivertDocument[] = [];

      for (const doc of d.dokumenter) {
        if (doc.dokumentInfoId === dokumentInfoId) {
          dokumenter.push({
            ...doc,
            logiskeVedlegg: updateLogiskeVedlegg(doc.logiskeVedlegg),
          });

          continue;
        }

        dokumenter.push({
          ...doc,
          vedlegg: doc.vedlegg.map((v) =>
            v.dokumentInfoId === dokumentInfoId
              ? {
                  ...v,
                  logiskeVedlegg: updateLogiskeVedlegg(v.logiskeVedlegg),
                }
              : v,
          ),
        });
      }

      return { ...d, dokumenter };
    });

    // Undo function
    return () => updateData(() => originalData);
  };
};

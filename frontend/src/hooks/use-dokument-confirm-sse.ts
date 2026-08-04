import { pushError } from '@app/observability';
import { KABIN_API_BASE_PATH } from '@app/redux/api/common';
import { updateDokumentMetadata } from '@app/redux/api/registreringer/documents';
import { DOKUMENT_TERMINAL_STATUSES, DokumentStatus } from '@app/redux/api/registreringer/types';
import { useEffect } from 'react';

const DOKUMENT_STATUS_VALUES = Object.values(DokumentStatus);

interface DokumentConfirmEventData {
  status: DokumentStatus;
  size: number;
  contentType: string;
}

/**
 * Opens an SSE connection to GET /registreringer/{id}/uploaded-documents/dokumenter/{dokumentId}/confirm while
 * `enabled` is true. Closes the connection once a terminal status is received, or on unmount.
 */
export const useDokumentConfirmSse = (registreringId: string, dokumentId: string, enabled: boolean): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const url = `${KABIN_API_BASE_PATH}/registreringer/${registreringId}/uploaded-documents/dokumenter/${dokumentId}/confirm`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.addEventListener('status', ({ data }: MessageEvent<string>) => {
      const parsed = parseJSON(data);

      if (parsed === null) {
        return;
      }

      if (!isDokumentConfirmEventData(parsed)) {
        pushError(new Error(`Ukjent dokumentstatus fra SSE: "${data}"`));

        return;
      }

      updateDokumentMetadata(registreringId, dokumentId, parsed);

      if (isTerminal(parsed.status)) {
        eventSource.close();
      }
    });

    eventSource.addEventListener('error', () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        pushError(new Error(`SSE-tilkobling for dokument ${dokumentId} ble avsluttet uventet`));
      }
    });

    return () => eventSource.close();
  }, [registreringId, dokumentId, enabled]);
};

const isDokumentStatus = (value: unknown): value is DokumentStatus =>
  typeof value === 'string' && DOKUMENT_STATUS_VALUES.some((status) => status === value);

const isDokumentConfirmEventData = (value: unknown): value is DokumentConfirmEventData => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { status, size, contentType } = value as Record<string, unknown>;

  return (
    isDokumentStatus(status) &&
    typeof size === 'number' &&
    Number.isSafeInteger(size) &&
    typeof contentType === 'string' &&
    contentType.length !== 0
  );
};

const isTerminal = (status: DokumentStatus) => DOKUMENT_TERMINAL_STATUSES.includes(status);

const parseJSON = (data: string): unknown => {
  try {
    return JSON.parse(data);
  } catch {
    pushError(new Error(`Ugyldig JSON i dokumentstatus fra SSE: "${data}"`));

    return null;
  }
};

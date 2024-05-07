import { request } from '@app/api/request';
import { KABIN_API_BASE_PATH } from '@app/simple-api-state/use-api';
import { CreateAnkeApiPayload, CreateKlageApiPayload } from '@app/types/create';
import { PreviewPdfPayload } from '@app/types/preview';

const headers = { 'Content-Type': 'application/json' };

export const editTitle = async (tittel: string, journalpostId: string, dokumentInfoId: string) =>
  request(`${KABIN_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/tittel`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ tittel }),
  });

export const createAnke = async (anke: CreateAnkeApiPayload) =>
  request(`${KABIN_API_BASE_PATH}/createanke`, {
    method: 'POST',
    headers,
    body: JSON.stringify(anke),
  });

export const createKlage = async (klage: CreateKlageApiPayload) =>
  request(`${KABIN_API_BASE_PATH}/createklage`, {
    method: 'POST',
    headers,
    body: JSON.stringify(klage),
  });

export const createSvarbrevPDF = async (data: PreviewPdfPayload, signal?: AbortSignal) =>
  request(`${KABIN_API_BASE_PATH}/svarbrev-preview`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  });

interface IAddLogiskVedlegg {
  dokumentInfoId: string;
  tittel: string;
}

export const addLogiskVedlegg = async ({ dokumentInfoId, ...data }: IAddLogiskVedlegg, signal?: AbortSignal) =>
  request(`${KABIN_API_BASE_PATH}/dokumenter/${dokumentInfoId}/logiskevedlegg`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    signal,
  });

interface IUpdateLogiskVedlegg extends IAddLogiskVedlegg {
  logiskVedleggId: string;
}

export const updateLogiskVedlegg = async (
  { dokumentInfoId, logiskVedleggId, ...data }: IUpdateLogiskVedlegg,
  signal?: AbortSignal,
) =>
  request(`${KABIN_API_BASE_PATH}/dokumenter/${dokumentInfoId}/logiskevedlegg/${logiskVedleggId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
    signal,
  });

interface IRemoveLogiskVedlegg {
  dokumentInfoId: string;
  logiskVedleggId: string;
}

export const removeLogiskVedlegg = async (
  { dokumentInfoId, logiskVedleggId }: IRemoveLogiskVedlegg,
  signal?: AbortSignal,
) =>
  request(`${KABIN_API_BASE_PATH}/dokumenter/${dokumentInfoId}/logiskevedlegg/${logiskVedleggId}`, {
    method: 'DELETE',
    signal,
  });

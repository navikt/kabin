import { request } from '@app/api/request';
import { KABIN_API_BASE_PATH } from '@app/simple-api-state/use-api';
import { CreateAnkeApiPayload, CreateKlageApiPayload } from '@app/types/create';

export const editTitle = async (tittel: string, journalpostId: string, dokumentInfoId: string) =>
  request(`${KABIN_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/tittel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tittel }),
  });

export const createAnke = async (anke: CreateAnkeApiPayload) =>
  request(`${KABIN_API_BASE_PATH}/createanke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anke),
  });

export const createKlage = async (klage: CreateKlageApiPayload) =>
  request(`${KABIN_API_BASE_PATH}/createklage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(klage),
  });

import { KABIN_API_BASE_PATH } from '../simple-api-state/use-api';
import { Create } from '../types/create';

export const editTitle = async (tittel: string, journalpostId: string, dokumentInfoId: string) =>
  fetch(`${KABIN_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/tittel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tittel }),
  });

export const createAnke = async (anke: Create) =>
  fetch(`${KABIN_API_BASE_PATH}/createanke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anke),
  });

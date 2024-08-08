import { INNSTILLINGER_BASE_PATH, KABAL_API_BASE_PATH } from '@app/redux/api/common';
import { loadStaticData } from '@app/static-data/loader';
import { IUserData } from '@app/types/bruker';

export interface CountryCode {
  land: string;
  landkode: string;
}
export interface PostalCode {
  postnummer: string;
  poststed: string;
}

export const user = loadStaticData<IUserData>(`${INNSTILLINGER_BASE_PATH}/me/brukerdata`, 'brukerdata');
export const countryCodes = loadStaticData<CountryCode[]>(`${KABAL_API_BASE_PATH}/landinfo`, 'landliste');
export const postalCodes = loadStaticData<PostalCode[]>(`${KABAL_API_BASE_PATH}/postinfo`, 'postnummerliste');

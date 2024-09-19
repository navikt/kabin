import type { IValidationSection } from '@app/types/validation';

export interface IError extends GenericObject {
  type: string;
  title: string;
  status: number;
  instance: string;
}

interface IValidationResponse extends IError {
  sections: IValidationSection[];
}

export interface IApiErrorReponse extends IError {
  detail: string;
}

type GenericObject = Record<string | number | symbol, unknown>;

export const isIError = (error: unknown): error is IError =>
  isObject(error) &&
  typeof error.type === 'string' &&
  typeof error.title === 'string' &&
  typeof error.status === 'number' &&
  typeof error.instance === 'string';

const isObject = (obj: unknown): obj is GenericObject => typeof obj === 'object' && obj !== null;

export const isApiError = (response: unknown): response is IApiErrorReponse =>
  isIError(response) && (typeof response.detail === 'string' || 'sections' in response);

export const isValidationResponse = (response: unknown): response is IValidationResponse =>
  isIError(response) && Array.isArray(response.sections) && response.sections.every(isValidationSection);

export const isValidationSection = (section: unknown): section is IValidationSection =>
  isObject(section) && typeof section.section === 'string' && Array.isArray(section.properties);

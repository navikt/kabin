import { FieldNames } from '../../hooks/use-field-name';
import { SectionNames } from '../../hooks/use-section-title';

export interface IValidationError {
  reason: string;
  field: FieldNames;
}

export interface IValidationSection {
  section: SectionNames;
  properties: IValidationError[];
}

export interface IApiValidationResponse {
  status: number;
  title: string;
  sections: IValidationSection[];
}

interface IError extends GenericObject {
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

const isIError = (error: GenericObject): error is IError =>
  typeof error['type'] === 'string' &&
  typeof error['title'] === 'string' &&
  typeof error['status'] === 'number' &&
  typeof error['instance'] === 'string';

const isObject = (obj: unknown): obj is GenericObject => typeof obj === 'object' && obj !== null;

export const isApiError = (response: unknown): response is IApiErrorReponse =>
  isObject(response) && isIError(response) && typeof response['detail'] === 'string';

export const isValidationResponse = (response: unknown): response is IValidationResponse =>
  isObject(response) &&
  isIError(response) &&
  Array.isArray(response['sections']) &&
  response['sections'].every(isValidationSection);

const isValidationSection = (section: unknown): section is IValidationSection =>
  isObject(section) && typeof section['section'] === 'string' && Array.isArray(section['properties']);

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

interface IError {
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

const isIError = (error: unknown): error is IError =>
  typeof error === 'object' &&
  error !== null &&
  typeof error['type'] === 'string' &&
  typeof error['title'] === 'string' &&
  typeof error['status'] === 'number' &&
  typeof error['instance'] === 'string';

export const isApiError = (response: unknown): response is IApiErrorReponse =>
  isIError(response) && typeof response['detail'] === 'string';

export const isValidationResponse = (error: unknown): error is IValidationResponse =>
  isIError(error) && Array.isArray(error['sections']) && error['sections'].every(isValidationSection);

const isValidationSection = (error: unknown): error is IValidationSection =>
  typeof error === 'object' &&
  error !== null &&
  typeof error['section'] === 'string' &&
  Array.isArray(error['properties']);

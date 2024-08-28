import type { IValidationSection, ValidationFieldNames } from '@app/types/validation';

export const useValidationError = (field: ValidationFieldNames): string | undefined => {
  const errors: IValidationSection[] = []; // TODO: Get errors from API.

  if (errors === null) {
    return undefined;
  }

  for (const { properties } of errors) {
    for (const property of properties) {
      if (property.field === field) {
        return property.reason;
      }
    }
  }

  return undefined;
};

import { useContext } from 'react';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { ValidationFieldNames } from '@app/types/validation';

export const useValidationError = (field: ValidationFieldNames): string | undefined => {
  const { errors } = useContext(ApiContext);

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

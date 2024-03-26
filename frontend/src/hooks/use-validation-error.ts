import { useContext } from 'react';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { ValidationFieldNames } from '@app/types/validation';

export const useValidationError = (field: ValidationFieldNames): string | undefined => {
  const { errors } = useContext(AppContext);

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

import { useContext } from 'react';
import { ApiContext } from '../pages/create/api-context';
import { FieldNames } from './use-field-name';

export const useValidationError = (field: FieldNames): string | undefined => {
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

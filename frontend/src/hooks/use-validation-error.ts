import { useAppStateStore } from '@app/pages/create/app-context/state';
import { ValidationFieldNames } from '@app/types/validation';

export const useValidationError = (field: ValidationFieldNames): string | undefined => {
  const errors = useAppStateStore((state) => state.errors);

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

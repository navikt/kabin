import { isValidationResponse, isValidationSection } from '@app/components/footer/error-type-guard';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';
import type { IValidationSection, ValidationFieldNames } from '@app/types/validation';

export const useValidationError = (field: ValidationFieldNames): string | undefined => {
  const id = useRegistreringId();
  const [, { error }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}:finish` });

  const sections = getValidationSections(error);

  for (const { properties } of sections) {
    for (const property of properties) {
      if (property.field === field) {
        return property.reason;
      }
    }
  }

  return undefined;
};

const getValidationSections = (error: unknown): IValidationSection[] => {
  if (error === undefined || error === null || typeof error !== 'object' || !('data' in error)) {
    return [];
  }

  const { data } = error;

  if (isValidationResponse(data)) {
    return data.sections;
  }

  if (isValidationSection(data)) {
    return [data];
  }

  return [];
};

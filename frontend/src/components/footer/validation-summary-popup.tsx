import { isApiError, isValidationResponse, isValidationSection } from '@app/components/footer/error-type-guard';
import { StyledHeader, ValidationSummary } from '@app/components/footer/validation-summary';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, HStack } from '@navikt/ds-react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

export const ValidationSummaryPopup = () => {
  const id = useRegistreringId();
  const [, { error }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}finish` });

  const hasValidationError = error !== undefined && 'status' in error && error.status === 400;
  const [isOpen, setIsOpen] = useState(hasValidationError);

  useEffect(() => {
    if (hasValidationError) {
      setIsOpen(true);
    }
  }, [hasValidationError]);

  if (!hasValidationError) {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  const Icon = isOpen ? ChevronDownIcon : ChevronUpIcon;

  return (
    <>
      <button type="button" className="cursor-pointer whitespace-nowrap border-0 bg-transparent" onClick={toggleOpen}>
        <Alert variant="warning" inline>
          <HStack align="center" wrap={false}>
            <span>Feil i utfyllingen</span>
            <Icon />
          </HStack>
        </Alert>
      </button>
      {isOpen ? (
        <div className="absolute right-4 bottom-16 w-100">
          <button
            type="button"
            className="absolute right-0 cursor-pointer whitespace-nowrap border-0 bg-transparent p-4"
            onClick={toggleOpen}
          >
            <Icon />
          </button>
          <RenderError error={error} />
        </div>
      ) : null}
    </>
  );
};

const isSerializedError = (error: FetchBaseQueryError | SerializedError): error is SerializedError => 'name' in error;

const RenderError = ({ error }: { error: FetchBaseQueryError | SerializedError }) => {
  if (isSerializedError(error)) {
    return (
      <Alert variant="error">
        <StyledHeader>Ukjent feil: {error.name}</StyledHeader>
        <BodyShort style={{ wordBreak: 'break-word' }}>{error.message}</BodyShort>
      </Alert>
    );
  }

  const { data } = error;

  if (isValidationResponse(data)) {
    return <ValidationSummary sections={data.sections} />;
  }

  if (isApiError(data)) {
    return (
      <Alert variant="warning">
        <StyledHeader>Kan ikke fullføre registrering.</StyledHeader>
        <BodyShort style={{ wordBreak: 'break-word' }}>
          {data.status} - {data.detail}
        </BodyShort>
      </Alert>
    );
  }

  if (isValidationSection(data)) {
    return <ValidationSummary sections={[data]} />;
  }

  return <Alert variant="error">Ukjent feil</Alert>;
};

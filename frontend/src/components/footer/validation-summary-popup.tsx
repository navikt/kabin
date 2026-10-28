import { isApiError, isValidationResponse, isValidationSection } from '@app/components/footer/error-type-guard';
import { ValidationSummary } from '@app/components/footer/validation-summary';
import { InfoBox } from '@app/components/info-box/info-box';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, InlineMessage } from '@navikt/ds-react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

export const ValidationSummaryPopup = () => {
  const id = useRegistreringId();
  const [, { error }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}:finish` });

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
      <button type="button" className="cursor-pointer border-0 bg-transparent whitespace-nowrap" onClick={toggleOpen}>
        <InlineMessage status="warning" size="small">
          <HStack align="center" wrap={false}>
            <span>Feil i utfyllingen</span>
            <Icon />
          </HStack>
        </InlineMessage>
      </button>
      {isOpen ? (
        <div className="absolute right-4 bottom-16 w-100">
          <button
            type="button"
            className="absolute right-0 cursor-pointer border-0 bg-transparent p-4 whitespace-nowrap"
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
      <InfoBox variant="danger">
        <Heading level="3" size="small">
          Ukjent feil: {error.name}
        </Heading>
        <BodyShort style={{ wordBreak: 'break-word' }}>{error.message}</BodyShort>
      </InfoBox>
    );
  }

  const { data } = error;

  if (isValidationResponse(data)) {
    return <ValidationSummary sections={data.sections} />;
  }

  if (isApiError(data)) {
    return (
      <InfoBox variant="warning">
        <Heading level="3" size="small">
          Kan ikke fullføre registrering.
        </Heading>
        <BodyShort style={{ wordBreak: 'break-word' }}>
          {data.status} - {data.detail}
        </BodyShort>
      </InfoBox>
    );
  }

  if (isValidationSection(data)) {
    return <ValidationSummary sections={[data]} />;
  }

  return <InfoBox variant="danger">Ukjent feil</InfoBox>;
};

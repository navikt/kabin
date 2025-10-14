import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';
import { type RegistreringType, SaksTypeEnum } from '@app/types/common';
import { ArrowUndoIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, ErrorSummary } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

export const FinishButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { id, typeId } = useRegistrering();
  const [, { isLoading: isFinishing }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}finish` });
  const [, { isLoading: isDeleting }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}delete` });

  const toggleConfirm = () => setShowConfirm(!showConfirm);
  const closeConfirm = () => setShowConfirm(false);

  return (
    <div style={{ position: 'relative' }}>
      <Button
        onClick={toggleConfirm}
        size="small"
        icon={<CheckmarkIcon aria-hidden />}
        variant="primary"
        disabled={isFinishing || isDeleting || typeId === null}
        loading={isFinishing}
      >
        Fullfør
      </Button>

      {showConfirm ? <Confirm closeConfirm={closeConfirm} /> : null}
    </div>
  );
};

const Confirm = ({ closeConfirm }: { closeConfirm: () => void }) => {
  const navigate = useNavigate();
  const registrering = useRegistrering();
  const { id, typeId, journalpostId, mulighet, sakenGjelderValue, svarbrev } = registrering;
  const [finish, { isLoading }] = useFinishRegistreringMutation({ fixedCacheKey: `${id}finish` });
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(closeConfirm, ref);

  if (typeId === null) {
    return null;
  }

  const text = getText(typeId, svarbrev?.send === true);

  const error = journalpostId === null || mulighet === null || sakenGjelderValue === null;
  const disabled = error || isLoading;

  return (
    <StyledConfirm ref={ref}>
      <Alert size="small" variant="info" inline>
        <BodyShort size="small" spacing>
          {text}
        </BodyShort>
        {error ? (
          <ErrorSummary size="small" heading="Følgende må fylles ut først">
            {sakenGjelderValue === null ? (
              <ErrorSummary.Item href="#sakengjelder">Du må velge en person.</ErrorSummary.Item>
            ) : null}
            {journalpostId === null ? (
              <ErrorSummary.Item href="#documents">Du må velge en journalpost.</ErrorSummary.Item>
            ) : null}
            {mulighet === null ? (
              <ErrorSummary.Item href="#mulighet">Du må velge en mulighet.</ErrorSummary.Item>
            ) : null}
          </ErrorSummary>
        ) : null}
      </Alert>
      <Buttons>
        <Button
          variant="primary"
          size="small"
          icon={<CheckmarkIcon aria-hidden />}
          loading={isLoading}
          onClick={async () => {
            if (disabled) {
              return;
            }

            await finish(registrering).unwrap();
            navigate(`/registrering/${id}/status`, { replace: true });
          }}
          disabled={disabled}
        >
          Bekreft
        </Button>
        <Button
          loading={isLoading}
          variant="secondary-neutral"
          size="small"
          onClick={closeConfirm}
          icon={<ArrowUndoIcon aria-hidden />}
        >
          Avbryt
        </Button>
      </Buttons>
    </StyledConfirm>
  );
};

const StyledConfirm = styled.div`
  background: var(--ax-bg-default);
  border: 1px solid var(--ax-border-accent);
  border-radius: 4px;
  position: absolute;
  padding: var(--ax-space-16);
  width: 400px;
  bottom: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--ax-shadow-dialog);
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const getText = (type: RegistreringType, sendSvarbrev: boolean) => {
  switch (type) {
    case SaksTypeEnum.ANKE: {
      if (sendSvarbrev) {
        return 'Du fullfører nå registrering av anken. Anken blir journalført og klar for saksbehandling i Kabal, og svarbrev sendes. Bekreft at du ønsker å fullføre registrering av anken.';
      }

      return 'Du fullfører nå registrering av anken. Anken blir journalført og klar for saksbehandling i Kabal. Bekreft at du ønsker å fullføre registrering av anken.';
    }
    case SaksTypeEnum.KLAGE: {
      if (sendSvarbrev) {
        return 'Du fullfører nå registrering av klagen. Klagen blir klar for saksbehandling i Kabal, og svarbrev sendes. Bekreft at du ønsker å fullføre registrering av klagen.';
      }

      return 'Du fullfører nå registrering av klagen. Klagen blir klar for saksbehandling i Kabal. Bekreft at du ønsker å fullføre registrering av klagen.';
    }
    case SaksTypeEnum.OMGJØRINGSKRAV: {
      if (sendSvarbrev) {
        return 'Du fullfører nå registrering av omgjøringskravet. Omgjøringskravet blir journalført og klart for saksbehandling i Kabal, og svarbrev sendes. Bekreft at du ønsker å fullføre registrering av omgjøringskravet.';
      }

      return 'Du fullfører nå registrering av omgjøringskravet. Omgjøringskravet blir journalført og klart for saksbehandling i Kabal. Bekreft at du ønsker å fullføre registrering av omgjøringskravet.';
    }
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK: {
      if (sendSvarbrev) {
        return 'Du fullfører nå registrering av begjæringen om gjenopptak av Trygderettens kjennelse. Begjæringen blir journalført og klar for saksbehandling i Kabal, og svarbrev sendes. Bekreft at du ønsker å fullføre registrering av begjæringen om gjenopptak.';
      }

      return 'Du fullfører nå registrering av begjæringen om gjenopptak av Trygderettens kjennelse. Begjæringen blir journalført og klar for saksbehandling i Kabal. Bekreft at du ønsker å fullføre registrering av begjæringen om gjenopptak.';
    }
  }
};

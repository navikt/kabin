import { ArrowUndoIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useFinishRegistreringMutation } from '@app/redux/api/registreringer/main';
import { RegistreringType, SaksTypeEnum } from '@app/types/common';

export const FinishButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleConfirm = () => setShowConfirm(!showConfirm);
  const closeConfirm = () => setShowConfirm(false);

  return (
    <>
      <Button onClick={toggleConfirm} size="small" icon={<CheckmarkIcon aria-hidden />} variant="primary">
        Fullfør
      </Button>

      {showConfirm ? <Confirm closeConfirm={closeConfirm} /> : null}
    </>
  );
};

const Confirm = ({ closeConfirm }: { closeConfirm: () => void }) => {
  const { id, typeId, svarbrev } = useRegistrering();
  const [finish, { isLoading }] = useFinishRegistreringMutation({ fixedCacheKey: id });
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(closeConfirm, ref);

  if (typeId === null) {
    return null;
  }

  const text = getText(typeId, svarbrev?.send === true);

  return (
    <StyledConfirm ref={ref}>
      <Alert size="small" variant="info" inline>
        {text}
      </Alert>
      <Buttons>
        <Button
          variant="primary"
          size="small"
          icon={<CheckmarkIcon aria-hidden />}
          loading={isLoading}
          onClick={() => finish(id)}
          disabled={isLoading}
        >
          Bekreft
        </Button>
        <Button variant="secondary" size="small" onClick={closeConfirm} icon={<ArrowUndoIcon aria-hidden />}>
          Avbryt
        </Button>
      </Buttons>
    </StyledConfirm>
  );
};

const StyledConfirm = styled.div`
  background: var(--a-surface-default);
  border: 1px solid var(--a-border-action);
  border-radius: 4px;
  position: absolute;
  padding: var(--a-spacing-4);
  width: 300px;
  bottom: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  }
};

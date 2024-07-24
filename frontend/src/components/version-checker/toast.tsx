import { CogRotationIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { CLOSE_TOAST_EVENT_TYPE } from '@app/components/toast/toast';
import { pushEvent } from '@app/observability';

interface Props {
  isRequired?: boolean;
}

export const VersionToast = ({ isRequired = false }: Props) => (
  <>
    <BodyShort size="small">Det finnes en ny versjon av Kabin.</BodyShort>
    {isRequired ? (
      <BodyShort size="small">Det er viktig at du oppdaterer så raskt som mulig.</BodyShort>
    ) : (
      <>
        <Warning size="small">Ikke-fullførte saker blir nullstilt ved oppdatering.</Warning>
        <Warning size="small">Gjør gjerne saken ferdig før du oppdaterer.</Warning>

        <Button
          variant="secondary"
          size="small"
          onClick={(e) => {
            pushEvent('close_update_toast', { required: isRequired ? 'true' : 'false' });
            e.target.dispatchEvent(new Event(CLOSE_TOAST_EVENT_TYPE, { bubbles: true }));
          }}
        >
          Ignorer oppdatering
        </Button>

        <Warning size="small">Du kan når som helst oppdatere Kabin ved å laste siden på nytt.</Warning>
      </>
    )}

    <Button
      variant="primary"
      size="small"
      icon={<CogRotationIcon aria-hidden />}
      onClick={() => {
        pushEvent('click_update_toast', { required: isRequired ? 'true' : 'false' });
        window.location.reload();
      }}
      data-testid="update-kabin-button"
    >
      Oppdater Kabin
    </Button>
  </>
);

const Warning = styled(BodyShort)`
  font-style: italic;
`;

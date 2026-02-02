import { CLOSE_TOAST_EVENT_TYPE } from '@app/components/toast/toast';
import { pushEvent } from '@app/observability';
import { CogRotationIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';

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
        <BodyShort size="small" className="italic">
          Gjør gjerne saken ferdig før du oppdaterer.
        </BodyShort>

        <Button
          data-color="neutral"
          variant="secondary"
          size="small"
          onClick={(e) => {
            pushEvent('close_update_toast', 'update', { required: isRequired ? 'true' : 'false' });
            e.target.dispatchEvent(new Event(CLOSE_TOAST_EVENT_TYPE, { bubbles: true }));
          }}
        >
          Ignorer oppdatering
        </Button>

        <BodyShort size="small" className="italic">
          Du kan når som helst oppdatere Kabin ved å laste siden på nytt.
        </BodyShort>
      </>
    )}

    <Button
      variant="primary"
      size="small"
      icon={<CogRotationIcon aria-hidden />}
      onClick={() => {
        pushEvent('click_update_toast', 'update', { required: isRequired ? 'true' : 'false' });
        window.location.reload();
      }}
      data-testid="update-kabin-button"
    >
      Oppdater Kabin
    </Button>
  </>
);

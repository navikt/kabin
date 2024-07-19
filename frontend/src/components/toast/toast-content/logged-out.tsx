import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { toast } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';

const LoggedOut = (
  <>
    <Heading level="1" size="xsmall">
      Du er blitt logget ut
    </Heading>
    <BodyShort size="small">Trykk her for å logge inn på nytt. Merk at alt du har fylt ut blir borte.</BodyShort>
    <Button size="small" onClick={() => window.location.reload()}>
      Logg inn
    </Button>
  </>
);

export const loggedOutToast = () => toast({ type: ToastType.ERROR, message: LoggedOut });

import { isoDateTimeToPretty } from '@app/domain/date';
import { useRegistrering } from '@app/hooks/use-registrering';
import { Status } from '@app/pages/status/status-page';
import { isDraftRegistrering } from '@app/redux/api/registreringer/types';
import { SaksTypeEnum } from '@app/types/common';
import { Navigate } from 'react-router-dom';

export const StatusPage = () => {
  const registrering = useRegistrering();

  if (isDraftRegistrering(registrering)) {
    return <Navigate to={`/registrering/${registrering.id}`} />;
  }

  if (registrering.typeId === SaksTypeEnum.KLAGE) {
    return (
      <Status
        registrering={registrering}
        alertText={`Klagen ble registrert og klar for saksbehandling i Kabal ${isoDateTimeToPretty(registrering.finished)}.`}
        headingText="Klage opprettet"
      />
    );
  }

  if (registrering.typeId === SaksTypeEnum.ANKE) {
    return (
      <Status
        registrering={registrering}
        alertText={`Anken ble registrert og klar for saksbehandling i Kabal ${isoDateTimeToPretty(registrering.finished)}.`}
        headingText="Anke opprettet"
      />
    );
  }

  if (registrering.typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return (
      <Status
        registrering={registrering}
        alertText={`Omgjøringskravet ble registrert og klar for saksbehandling i Kabal ${isoDateTimeToPretty(registrering.finished)}.`}
        headingText="Omgjøringskrav opprettet"
      />
    );
  }

  console.error('Unknown sakstype for finished registrering', registrering.typeId);

  return null;
};

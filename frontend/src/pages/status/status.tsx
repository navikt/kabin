import { useRegistrering } from '@app/hooks/use-registrering';
import { AnkeStatusPage } from '@app/pages/status/anke-status';
import { KlageStatusPage } from '@app/pages/status/klage-status';
import { OmgjøringskravStatusPage } from '@app/pages/status/omgjøringskrav-status';
import { isDraftRegistrering } from '@app/redux/api/registreringer/types';
import { SaksTypeEnum } from '@app/types/common';
import { Navigate } from 'react-router-dom';

export const StatusPage = () => {
  const registrering = useRegistrering();

  if (isDraftRegistrering(registrering)) {
    return <Navigate to={`/registrering/${registrering.id}`} />;
  }

  if (registrering.typeId === SaksTypeEnum.KLAGE) {
    return <KlageStatusPage registrering={registrering} />;
  }

  if (registrering.typeId === SaksTypeEnum.ANKE) {
    return <AnkeStatusPage registrering={registrering} />;
  }

  if (registrering.typeId === SaksTypeEnum.OMGJØRINGSKRAV) {
    return <OmgjøringskravStatusPage registrering={registrering} />;
  }

  console.error('Unknown sakstype for finished registrering', registrering.typeId);

  return null;
};

import { InfoBox } from '@app/components/info-box/info-box';
import { parseDate } from '@app/functions/date';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useGetFeatureToggleQuery } from '@app/redux/api/feature-toggles';
import { SaksTypeEnum } from '@app/types/common';
import type {
  IAnkemulighet,
  IAnkemulighetAfter2027,
  IBegjæringOmGjenopptakMulighet,
  IBegjæringOmGjenopptakMulighetAfter2027,
} from '@app/types/mulighet';
import { isBefore } from 'date-fns';

const START_OF_2027 = parseDate('2027-01-01');
const FAKE_START_OF_2027 = parseDate('2026-06-06');

const getIsTooOld = (date: string | undefined | null) => {
  if (date === undefined || date === null) {
    return false;
  }

  return isBefore(parseDate(date), START_OF_2027);
};

const useIsTooNew = (date: string | undefined | null) => {
  const { data } = useGetFeatureToggleQuery('kabin-fake-date-constraint');

  if (date === undefined || date === null) {
    return false;
  }

  const endDate = data?.enabled === true ? FAKE_START_OF_2027 : START_OF_2027;

  return !isBefore(parseDate(date), endDate);
};

interface MulighetWarningForSakFraTRAfter2027Props {
  mulighet: IAnkemulighetAfter2027 | IBegjæringOmGjenopptakMulighetAfter2027 | undefined;
}

export const MulighetWarningForSakFraTRAfter2027 = ({ mulighet }: MulighetWarningForSakFraTRAfter2027Props) => {
  const isTooOld = getIsTooOld(mulighet?.vedtakDate);
  const canEdit = useCanEdit();

  if (!isTooOld || !canEdit || mulighet === undefined) {
    return null;
  }

  return (
    <InfoBox variant="warning" className="w-fit">
      {getOldMulighetWarningMessage(mulighet.mulighetTypeId)}
    </InfoBox>
  );
};

interface MulighetWarningForSakFraTRBefore2027Props {
  mulighet: IAnkemulighet | IBegjæringOmGjenopptakMulighet | undefined;
}

export const MulighetWarningForSakFraTRBefore2027 = ({ mulighet }: MulighetWarningForSakFraTRBefore2027Props) => {
  const isTooNew = useIsTooNew(mulighet?.vedtakDate);
  const canEdit = useCanEdit();

  if (!isTooNew || !canEdit || mulighet === undefined) {
    return null;
  }

  return (
    <InfoBox variant="warning" className="w-fit">
      {getNewMulighetWarningMessage(mulighet.mulighetTypeId)}
    </InfoBox>
  );
};

export const JournalpostForSakFraTRAfter2027Warning = () => {
  const { mulighetIsBasedOnJournalpost, typeId } = useRegistrering();
  const { data, isSuccess } = useJournalpostFromMulighet();
  const canEdit = useCanEdit();

  if (!mulighetIsBasedOnJournalpost || !isSuccess || !canEdit) {
    return null;
  }

  if (typeId !== SaksTypeEnum.ANKE_AFTER_2027 && typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027) {
    return null;
  }

  if (getIsTooOld(data?.datoOpprettet)) {
    return (
      <InfoBox variant="warning" className="w-fit">
        {getOldMulighetWarningMessage(typeId)}
      </InfoBox>
    );
  }

  return null;
};

export const JournalpostForSakFraTRBefore2027Warning = () => {
  const { mulighetIsBasedOnJournalpost, typeId } = useRegistrering();
  const { data, isSuccess } = useJournalpostFromMulighet();
  const isTooNew = useIsTooNew(data?.datoOpprettet);
  const canEdit = useCanEdit();

  if (!mulighetIsBasedOnJournalpost || !isSuccess || !canEdit) {
    return null;
  }

  if (typeId !== SaksTypeEnum.ANKE && typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK) {
    return null;
  }

  if (isTooNew) {
    return (
      <InfoBox variant="warning" className="w-fit">
        {getNewMulighetWarningMessage(typeId)}
      </InfoBox>
    );
  }

  return null;
};

const getOldMulighetWarningMessage = (
  type: SaksTypeEnum.ANKE_AFTER_2027 | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027,
): string => {
  switch (type) {
    case SaksTypeEnum.ANKE_AFTER_2027:
      return 'Du har valgt at anken gjelder et vedtak før 1. januar 2027. Er du sikker på at du har valgt riktig?';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027:
      return 'Du har valgt at begjæringen om gjenopptak gjelder et vedtak før 1. januar 2027. Er du sikker på at du har valgt riktig?';
  }
};

const getNewMulighetWarningMessage = (type: SaksTypeEnum.ANKE | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK): string => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return 'Du har valgt at anken gjelder et vedtak etter 1. januar 2027. Er du sikker på at du har valgt riktig?';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return 'Du har valgt at begjæringen om gjenopptak gjelder et vedtak etter 1. januar 2027. Er du sikker på at du har valgt riktig?';
  }
};

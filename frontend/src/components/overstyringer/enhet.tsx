import { FIELD_NAMES } from '@app/hooks/use-field-name';
import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useGetLatestYtelserQuery } from '@app/redux/api/kodeverk';
import { useSetForrigeBehandlendeEnhetIdMutation } from '@app/redux/api/overstyringer/overstyringer';
import { SaksTypeEnum } from '@app/types/common';
import { FAGSYSTEM_ARENA } from '@app/types/fagsystem';
import type { IKodeverkSimpleValue, IYtelserLatest } from '@app/types/kodeverk';
import { ValidationFieldNames } from '@app/types/validation';
import { InlineMessage, Label, Select, Skeleton } from '@navikt/ds-react';

const FIELD_NAME = ValidationFieldNames.FORRIGE_BEHANDLENDE_ENHET_ID;

export const Enhet = () => {
  const { overstyringer } = useRegistrering();
  const { fromJournalpost, typeId } = useMulighet();
  const { journalpost } = useJournalpostFromMulighet();

  const show =
    fromJournalpost &&
    (typeId === SaksTypeEnum.KLAGE || typeId === SaksTypeEnum.ANKE) &&
    journalpost?.sak?.fagsystemId === FAGSYSTEM_ARENA;

  if (!show || overstyringer.ytelseId === null) {
    return null;
  }

  return <EnhetInternal typeId={typeId} />;
};

const EnhetInternal = ({ typeId }: { typeId: SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE }) => {
  const { overstyringer, id } = useRegistrering();
  const { data = [], isLoading: ytelserIsLoading, isSuccess: ytelserIsSuccess } = useGetLatestYtelserQuery();
  const [setEnhet, { isLoading }] = useSetForrigeBehandlendeEnhetIdMutation();
  const error = useValidationError(FIELD_NAME);

  if (ytelserIsLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Label size="small" htmlFor={FIELD_NAME}>
          {FIELD_NAMES.forrigeBehandlendeEnhetId}
        </Label>
        <Skeleton variant="rectangle" height="32px" id={FIELD_NAME} />
      </div>
    );
  }

  const ytelse = data.find(({ id }) => id === overstyringer.ytelseId);

  if (!ytelserIsSuccess || ytelse === undefined) {
    return (
      <InlineMessage status="error" size="small">
        Enheter for ytelse ikke funnet
      </InlineMessage>
    );
  }

  const value = overstyringer.forrigeBehandlendeEnhetId ?? NONE;

  return (
    <Select
      size="small"
      label={FIELD_NAMES.forrigeBehandlendeEnhetId}
      value={value}
      onChange={(event) => setEnhet({ id, forrigeBehandlendeEnhetId: event.currentTarget.value })}
      disabled={isLoading}
      error={error}
    >
      {value === NONE ? (
        <option value={NONE} disabled>
          Ikke valgt
        </option>
      ) : null}

      {getEnheter(typeId, ytelse).map((e) => (
        <option key={e.id} value={e.id}>
          {e.navn}
        </option>
      ))}
    </Select>
  );
};

const getEnheter = (typeId: SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE, ytelse: IYtelserLatest): IKodeverkSimpleValue[] => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return ytelse.enheter;
    case SaksTypeEnum.ANKE:
      return ytelse.klageenheter;
  }
};

const NONE = 'NONE';

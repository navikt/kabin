import {
  type Entry,
  SearchableSelect,
} from '@app/components/searchable-select/searchable-single-select/searchable-single-select';
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
import { InlineMessage, Label, Skeleton, Tag } from '@navikt/ds-react';

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

  const ytelse = data.find(({ id: ytelseId }) => ytelseId === overstyringer.ytelseId);

  if (!ytelserIsSuccess || ytelse === undefined) {
    return (
      <InlineMessage status="error" size="small">
        Enheter for ytelse ikke funnet
      </InlineMessage>
    );
  }

  const enheter = getEnheter(typeId, ytelse);
  const options: Entry<string>[] = enheter.map((e) => enhetToEntry(e));
  const selectedEntry = options.find((o) => o.value === overstyringer.forrigeBehandlendeEnhetId) ?? null;

  return (
    <div className="flex flex-col gap-2">
      <Label size="small" htmlFor={FIELD_NAME}>
        {FIELD_NAMES.forrigeBehandlendeEnhetId}
      </Label>
      <SearchableSelect
        id={FIELD_NAME}
        label={FIELD_NAMES.forrigeBehandlendeEnhetId}
        options={options}
        value={selectedEntry}
        onChange={(enhetId) => setEnhet({ id, forrigeBehandlendeEnhetId: enhetId })}
        disabled={isLoading}
        error={error}
        nullLabel="Ikke valgt"
      />
    </div>
  );
};

const enhetToEntry = (enhet: IKodeverkSimpleValue): Entry<string> => ({
  value: enhet.id,
  key: enhet.id,
  plainText: `${enhet.id} ${enhet.navn}`,
  label: (
    <span className="flex items-center gap-2">
      <Tag variant="outline" data-color="meta-purple" size="xsmall">
        {enhet.id}
      </Tag>
      {enhet.navn}
    </span>
  ),
});

const getEnheter = (typeId: SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE, ytelse: IYtelserLatest): IKodeverkSimpleValue[] => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return ytelse.enheter;
    case SaksTypeEnum.ANKE:
      return ytelse.klageenheter;
  }
};

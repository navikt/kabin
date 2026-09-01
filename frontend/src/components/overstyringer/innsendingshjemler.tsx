import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { HjemmelTag, ReadOnlyHjemler } from '@app/components/read-only-info/read-only-info';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useJournalpostFromMulighet } from '@app/hooks/use-journalpost';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useGetLatestYtelserQuery } from '@app/redux/api/kodeverk';
import { useSetHjemmelIdListMutation } from '@app/redux/api/overstyringer/overstyringer';
import { SaksTypeEnum } from '@app/types/common';
import { FAGSYSTEM_ARENA } from '@app/types/fagsystem';
import { ValidationFieldNames } from '@app/types/validation';
import { HStack, InlineMessage, Label, LocalAlert, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';

const ID = ValidationFieldNames.HJEMMEL_ID_LIST;

export const Innsendingshjemler = () => {
  const { id, typeId, overstyringer } = useRegistrering();
  const { data = [] } = useGetLatestYtelserQuery();
  const { hjemmelIdList } = overstyringer;
  const [setHjemmelIdList] = useSetHjemmelIdListMutation();
  const canEdit = useCanEdit();
  const ytelseId = useYtelseId();

  const error = useValidationError(ID);

  const options = useMemo(() => {
    const ytelse = data.find(({ id }) => id === ytelseId);

    return ytelse === undefined
      ? []
      : ytelse.innsendingshjemler.filter((i) => !i.utfases).map((i) => ({ value: i.id, label: i.beskrivelse }));
  }, [data, ytelseId]);

  if (typeId === null) {
    return null;
  }

  if (!canEdit) {
    return <ReadOnlyHjemler id={ID} label="hjemler" hjemmelIdList={hjemmelIdList} />;
  }

  if (options.length === 0) {
    return (
      <VStack gap="space-8" className="col-2">
        <Label size="small">Hjemler</Label>
        <InlineMessage status="info" size="small">
          {ytelseId === null ? 'Velg ytelse.' : 'Valgt ytelse har ingen hjemler.'}
        </InlineMessage>
      </VStack>
    );
  }

  return (
    <VStack gap="space-16">
      <FilterDropdown
        className="col-2"
        label="Hjemler"
        options={options}
        selected={hjemmelIdList ?? []}
        onChange={(list) => setHjemmelIdList({ id, hjemmelIdList: list })}
        error={error}
        id={ID}
        disabled={ytelseId === null}
      >
        <HStack gap="space-4" wrap>
          {hjemmelIdList?.map((h) => (
            <HjemmelTag hjemmelId={h} key={h} />
          ))}
        </HStack>
      </FilterDropdown>

      <PermitteringWarning />
    </VStack>
  );
};

const PermitteringWarning = () => {
  const { typeId, overstyringer } = useRegistrering();
  const { data: journalpost } = useJournalpostFromMulighet();
  const { hjemmelIdList } = overstyringer;

  if (typeId !== SaksTypeEnum.KLAGE && typeId !== SaksTypeEnum.ANKE) {
    return null;
  }

  if (journalpost?.sak?.fagsystemId !== FAGSYSTEM_ARENA) {
    return null;
  }

  if (!hjemmelIdList?.includes(FTRL_4_7_PERMITTERINGSÅRSAK)) {
    return null;
  }

  return (
    <LocalAlert status="warning" size="small">
      <LocalAlert.Header>
        <LocalAlert.Title>Advarsel</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>Husk at du må merke oppgaven i Arena med firmanavn.</LocalAlert.Content>
    </LocalAlert>
  );
};

const FTRL_4_7_PERMITTERINGSÅRSAK = 'FTRL_4_7_PERMITTERINGSAARSAK';

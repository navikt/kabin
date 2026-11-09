import { PartWriteCommon } from '@app/components/overstyringer/part-write-common';
import { type BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { isValidOrgnr } from '@app/domain/orgnr';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useSetFullmektigMutation, useSetKlagerMutation } from '@app/redux/api/overstyringer/overstyringer';
import { useGetPartWithUtsendingskanalQuery } from '@app/redux/api/part';
import type { SearchPartWithUtsendingskanalParams } from '@app/redux/api/registreringer/param-types';
import type { IPart } from '@app/types/common';
import { idnr } from '@navikt/fnrvalidator';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useMemo, useState } from 'react';

interface Props extends BaseProps {
  exitSearchMode: () => void;
  error?: string;
  partField: FieldNames.FULLMEKTIG | FieldNames.KLAGER;
}

export const PartSearch = (props: Props) => {
  const setFullmektig = useSetFullmektigMutation();
  const setKlager = useSetKlagerMutation();
  const id = useRegistreringId();

  const mutation = useMemo(() => {
    switch (props.partField) {
      case FieldNames.FULLMEKTIG:
        return setFullmektig;
      case FieldNames.KLAGER:
        return setKlager;
    }
  }, [props.partField, setFullmektig, setKlager]);

  const [set, { isLoading }] = mutation;

  const setPart = (part: IPart | null) => set({ id, part });

  return <PartSearchInternal {...props} setPart={setPart} isSaving={isLoading} />;
};

interface InternalProps extends Props {
  setPart: (part: IPart | null) => void;
  isSaving: boolean;
}

const PartSearchInternal = ({
  part,
  partField,
  label,
  exitSearchMode,
  icon,
  error: validationError,
  setPart,
  isSaving,
  excludedPartIds = [],
}: InternalProps) => {
  const { sakenGjelderValue } = useRegistrering();
  const [rawSearch, setSearch] = useState('');
  const search = rawSearch.replaceAll(' ', '');
  const ytelseId = useYtelseId();

  const isValid = useMemo(() => idnr(search).status === 'valid' || isValidOrgnr(search), [search]);

  const searchParams = useMemo<SearchPartWithUtsendingskanalParams | typeof skipToken>(() => {
    if (!isValid || sakenGjelderValue === null || ytelseId === null) {
      return skipToken;
    }

    return {
      identifikator: search,
      sakenGjelderId: sakenGjelderValue,
      ytelseId,
    };
  }, [isValid, sakenGjelderValue, ytelseId, search]);

  const query = useGetPartWithUtsendingskanalQuery(searchParams);

  const setPartAndClose = (p: IPart | null) => {
    setPart(p);
    exitSearchMode();
  };

  return (
    <PartWriteCommon
      rawSearch={rawSearch}
      setSearch={setSearch}
      part={part}
      partField={partField}
      label={label}
      exitSearchMode={exitSearchMode}
      icon={icon}
      error={validationError}
      setPart={setPartAndClose}
      isSaving={isSaving}
      query={query}
      excludedPartIds={excludedPartIds}
      isValid={isValid}
      search={search}
    />
  );
};

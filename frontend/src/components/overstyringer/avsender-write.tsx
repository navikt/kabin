import { PartWriteCommon } from '@app/components/overstyringer/part-write-common';
import { type BaseProps, FieldNames } from '@app/components/overstyringer/types';
import { isValidOrgnr } from '@app/domain/orgnr';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useSetAvsenderMutation } from '@app/redux/api/overstyringer/overstyringer';
import { useGetPartQuery } from '@app/redux/api/part';
import type { ISimplePart } from '@app/types/common';
import { idnr } from '@navikt/fnrvalidator';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useMemo, useState } from 'react';

interface Props extends Omit<BaseProps, 'partField'> {
  exitSearchMode: () => void;
  error?: string;
}

export const AvsenderSearch = ({
  part,
  label,
  exitSearchMode,
  icon,
  error: validationError,
  excludedPartIds = [],
}: Props) => {
  const id = useRegistreringId();
  const [setPart, { isLoading: isSaving }] = useSetAvsenderMutation();
  const [rawSearch, setSearch] = useState('');
  const search = rawSearch.replaceAll(' ', '');

  const isValid = useMemo(() => idnr(search).status === 'valid' || isValidOrgnr(search), [search]);

  const query = useGetPartQuery(isValid ? search : skipToken);

  const setPartAndClose = (p: ISimplePart | null) => {
    setPart({ id, part: p });
    exitSearchMode();
  };

  return (
    <PartWriteCommon
      rawSearch={rawSearch}
      setSearch={setSearch}
      part={part}
      partField={FieldNames.AVSENDER}
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

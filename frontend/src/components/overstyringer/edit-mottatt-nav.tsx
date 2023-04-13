import { parseISO } from 'date-fns';
import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { Datepicker } from '@app/components/date-picker/date-picker';
import { ValidationFieldNames } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';

export const EditMottattNAV = () => {
  const { type, payload, journalpost } = useContext(ApiContext);

  if (
    type === Type.NONE ||
    journalpost === null ||
    payload.overstyringer.mottattNav === null ||
    payload.mulighet === null
  ) {
    return null;
  }

  return (
    <RenderEditMottattNAV
      value={payload.overstyringer.mottattNav}
      toDate={journalpost.registrert}
      fromDate={payload.mulighet.vedtakDate}
    />
  );
};

interface Props {
  value: string;
  toDate: string;
  fromDate: string;
}

const RenderEditMottattNAV = ({ value, toDate, fromDate }: Props) => {
  const { type, updatePayload } = useContext(ApiContext);
  const error = useValidationError(ValidationFieldNames.MOTTATT_NAV);

  const parsedValue = useMemo(() => parseISO(value), [value]);
  const parsedToDate = useMemo(() => parseISO(toDate), [toDate]);
  const parsedFromDate = useMemo(() => parseISO(fromDate), [fromDate]);

  const onChange = useCallback(
    (mottattNav: string | null) => {
      if (type === Type.NONE) {
        return;
      }

      updatePayload({ overstyringer: { mottattNav } });
    },
    [type, updatePayload]
  );

  return (
    <StyledDatepicker
      label="Mottatt NAV Klageinstans"
      onChange={onChange}
      value={parsedValue}
      size="small"
      toDate={parsedToDate}
      fromDate={parsedFromDate}
      id={ValidationFieldNames.MOTTATT_NAV}
      error={error}
    />
  );
};

const StyledDatepicker = styled(Datepicker)`
  grid-area: mottattnav;
`;

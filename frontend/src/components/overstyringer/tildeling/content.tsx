import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useYtelseId } from '@app/hooks/use-ytelse-id';
import { useSetSaksbehandlerIdentMutation } from '@app/redux/api/overstyringer/overstyringer';
import { type ISaksbehandlereParams, useGetSaksbehandlereQuery } from '@app/redux/api/saksbehandlere';
import type { ISaksbehandler } from '@app/types/common';
import { Alert, Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

export const Content = () => {
  const saksbehandler = useSaksbehandler();
  const params = useSaksbehandlereParams();
  const { data } = useGetSaksbehandlereQuery(params);
  const { id, overstyringer } = useRegistrering();
  const { typeId } = useMulighet();
  const { saksbehandlerIdent } = overstyringer;
  const [setSaksbehandlerIdent] = useSetSaksbehandlerIdentMutation();
  const ytelseId = useYtelseId();

  if (typeId === null) {
    return (
      <Alert size="small" variant="info" inline>
        Velg type først.
      </Alert>
    );
  }

  if (ytelseId === null) {
    return (
      <Alert size="small" variant="info" inline>
        Velg ytelse først.
      </Alert>
    );
  }

  return (
    <>
      <Select
        size="small"
        label="Saksbehandler"
        hideLabel
        value={saksbehandlerIdent ?? NONE}
        onChange={(e) =>
          setSaksbehandlerIdent({ id, saksbehandlerIdent: e.target.value === NONE ? null : e.target.value })
        }
      >
        <option value={NONE}>Ingen</option>
        {data?.saksbehandlere.map(({ navIdent, navn }) => (
          <option key={navIdent} value={navIdent}>
            {navn}
          </option>
        ))}
      </Select>
      <CopyPartIdButton id={saksbehandler?.navIdent ?? null} />
    </>
  );
};

export const useSaksbehandlereParams = (): ISaksbehandlereParams | typeof skipToken => {
  const { sakenGjelderValue } = useRegistrering();
  const { typeId } = useMulighet();
  const ytelseId = useYtelseId();

  if (typeId === null || ytelseId === null || sakenGjelderValue === null) {
    return skipToken;
  }

  return { ytelseId, fnr: sakenGjelderValue };
};

export const useSaksbehandler = (): ISaksbehandler | null => {
  const params = useSaksbehandlereParams();
  const { data } = useGetSaksbehandlereQuery(params);
  const { overstyringer } = useRegistrering();
  const { saksbehandlerIdent } = overstyringer;

  return data?.saksbehandlere.find((saksbehandler) => saksbehandler.navIdent === saksbehandlerIdent) ?? null;
};

const NONE = 'NONE';

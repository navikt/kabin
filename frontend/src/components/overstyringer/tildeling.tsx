import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Select } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { CopyPartIdButton } from '@app/components/copy-button/copy-part-id';
import { StyledSaksbehandlerIcon } from '@app/components/overstyringer/icons';
import {
  PartActionsContainer,
  PartContent,
  PartTextContent,
  StyledContainer,
  getState,
} from '@app/components/overstyringer/styled-components';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useFieldName } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ApiContext } from '@app/pages/create/api-context/api-context';
import { Type } from '@app/pages/create/api-context/types';
import { ISaksbehandlerParams, useSaksbehandlere } from '@app/simple-api-state/use-api';
import { ISaksbehandler, skipToken } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

export const Tildeling = () => {
  const { payload } = useContext(ApiContext);
  const label = useFieldName(ValidationFieldNames.SAKSBEHANDLER);

  const error = useValidationError(ValidationFieldNames.SAKSBEHANDLER);

  return (
    <StyledContainer
      id={ValidationFieldNames.SAKSBEHANDLER}
      $state={getState(payload?.overstyringer.saksbehandlerIdent, error)}
    >
      <StyledSaksbehandlerIcon aria-hidden />
      <PartContent>
        <PartTextContent>
          <Heading level="3" size="xsmall">
            {label}
          </Heading>
          <Content />

          <ValidationErrorMessage error={error} />
        </PartTextContent>

        <Actions />
      </PartContent>
    </StyledContainer>
  );
};

const useSaksbehandlereParams = (): ISaksbehandlerParams | typeof skipToken => {
  const { payload, type } = useContext(ApiContext);

  if (type === Type.NONE || payload.mulighet === null) {
    return skipToken;
  }

  if (type === Type.ANKE) {
    return { ytelseId: payload.mulighet.ytelseId, fnr: payload.mulighet.sakenGjelder.id };
  }

  if (payload.overstyringer.ytelseId === null) {
    return skipToken;
  }

  return { ytelseId: payload.overstyringer.ytelseId, fnr: payload.mulighet.sakenGjelder.id };
};

const useSaksbehandler = (): ISaksbehandler | null => {
  const params = useSaksbehandlereParams();
  const { data } = useSaksbehandlere(params);
  const { payload } = useContext(ApiContext);

  return (
    data?.saksbehandlere.find(
      (saksbehandler) => saksbehandler.navIdent === payload?.overstyringer.saksbehandlerIdent
    ) ?? null
  );
};

const NONE = 'NONE';

const Content = () => {
  const saksbehandler = useSaksbehandler();
  const params = useSaksbehandlereParams();
  const { data } = useSaksbehandlere(params);
  const { payload, updatePayload, type } = useContext(ApiContext);

  if (type === Type.NONE) {
    return null;
  }

  if (params === skipToken) {
    const message = type === Type.ANKE ? 'Velg mulighet.' : 'Velg ytelse.';

    return (
      <Alert size="small" variant="info" inline>
        {message}
      </Alert>
    );
  }

  return (
    <>
      <Select
        size="small"
        label="Saksbehandler"
        hideLabel
        value={payload?.overstyringer.saksbehandlerIdent ?? NONE}
        onChange={(e) =>
          updatePayload({ overstyringer: { saksbehandlerIdent: e.target.value === NONE ? null : e.target.value } })
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

const Actions = () => {
  const { payload, type } = useContext(ApiContext);

  if (type === Type.NONE || payload.mulighet === null) {
    return null;
  }

  return (
    <PartActionsContainer>
      <SetButton label="Fjern" title="Fjern" icon={<TrashIcon aria-hidden />} saksbehandlerIdent={null} />
      {type === Type.ANKE && payload.mulighet.previousSaksbehandler !== null ? (
        <SetButton
          label="Fra klagen"
          title={payload.mulighet.previousSaksbehandler.navn}
          saksbehandlerIdent={payload.mulighet.previousSaksbehandler.navIdent}
        />
      ) : null}
    </PartActionsContainer>
  );
};

interface SetButtonProps {
  label: string;
  title: string;
  icon?: React.ReactNode;
  saksbehandlerIdent: string | null;
}

const SetButton = ({ label, title, icon, saksbehandlerIdent }: SetButtonProps) => {
  const { payload, updatePayload, type } = useContext(ApiContext);
  const params = useSaksbehandlereParams();
  const { data, isLoading } = useSaksbehandlere(params);

  if (
    type === Type.NONE ||
    isLoading ||
    payload.overstyringer.saksbehandlerIdent === saksbehandlerIdent ||
    typeof data === 'undefined'
  ) {
    return null;
  }

  const validSaksbehandler =
    saksbehandlerIdent === null || data.saksbehandlere.some((s) => s.navIdent === saksbehandlerIdent);

  if (!validSaksbehandler) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="secondary"
      title={title}
      icon={icon}
      onClick={() => updatePayload({ overstyringer: { saksbehandlerIdent } })}
    >
      {label}
    </Button>
  );
};

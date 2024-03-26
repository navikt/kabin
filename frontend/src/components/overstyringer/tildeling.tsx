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
import { AppContext } from '@app/pages/create/app-context/app-context';
import { Type } from '@app/pages/create/app-context/types';
import { ISaksbehandlerParams, useSaksbehandlere } from '@app/simple-api-state/use-api';
import { ISaksbehandler, skipToken } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

export const Tildeling = () => {
  const { state } = useContext(AppContext);
  const label = useFieldName(ValidationFieldNames.SAKSBEHANDLER);

  const error = useValidationError(ValidationFieldNames.SAKSBEHANDLER);

  return (
    <StyledContainer
      id={ValidationFieldNames.SAKSBEHANDLER}
      $state={getState(state?.overstyringer.saksbehandlerIdent, error)}
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
  const { state, type } = useContext(AppContext);

  if (type === Type.NONE || state.mulighet === null || state.overstyringer.ytelseId === null) {
    return skipToken;
  }

  return { ytelseId: state.overstyringer.ytelseId, fnr: state.mulighet.sakenGjelder.id };
};

const useSaksbehandler = (): ISaksbehandler | null => {
  const params = useSaksbehandlereParams();
  const { data } = useSaksbehandlere(params);
  const { state } = useContext(AppContext);

  return (
    data?.saksbehandlere.find((saksbehandler) => saksbehandler.navIdent === state?.overstyringer.saksbehandlerIdent) ??
    null
  );
};

const NONE = 'NONE';

const Content = () => {
  const saksbehandler = useSaksbehandler();
  const params = useSaksbehandlereParams();
  const { data } = useSaksbehandlere(params);
  const { state, updateState, type } = useContext(AppContext);

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
        value={state?.overstyringer.saksbehandlerIdent ?? NONE}
        onChange={(e) =>
          updateState({ overstyringer: { saksbehandlerIdent: e.target.value === NONE ? null : e.target.value } })
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
  const { state, type } = useContext(AppContext);

  if (type === Type.NONE || state.mulighet === null) {
    return null;
  }

  return (
    <PartActionsContainer>
      <SetButton label="Fjern" title="Fjern" icon={<TrashIcon aria-hidden />} saksbehandlerIdent={null} />
      {type === Type.ANKE && state.mulighet.previousSaksbehandler !== null ? (
        <SetButton
          label="Fra klagen"
          title={state.mulighet.previousSaksbehandler.navn}
          saksbehandlerIdent={state.mulighet.previousSaksbehandler.navIdent}
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
  const { state, updateState, type } = useContext(AppContext);
  const params = useSaksbehandlereParams();
  const { data, isLoading } = useSaksbehandlere(params);

  if (
    type === Type.NONE ||
    isLoading ||
    state.overstyringer.saksbehandlerIdent === saksbehandlerIdent ||
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
      onClick={() => updateState({ overstyringer: { saksbehandlerIdent } })}
    >
      {label}
    </Button>
  );
};

import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Select } from '@navikt/ds-react';
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
import { useAppStateStore, useOverstyringerStore } from '@app/pages/create/app-context/state';
import { Type } from '@app/pages/create/app-context/types';
import { ISaksbehandlerParams, useSaksbehandlere } from '@app/simple-api-state/use-api';
import { ISaksbehandler, skipToken } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

export const Tildeling = () => {
  const saksbehandlerIdent = useOverstyringerStore((state) => state.saksbehandlerIdent);
  const label = useFieldName(ValidationFieldNames.SAKSBEHANDLER);

  const error = useValidationError(ValidationFieldNames.SAKSBEHANDLER);

  return (
    <StyledContainer id={ValidationFieldNames.SAKSBEHANDLER} $state={getState(saksbehandlerIdent, error)}>
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
  const { type, mulighet } = useAppStateStore();
  const ytelseId = useOverstyringerStore((state) => state.ytelseId);

  if (type === Type.NONE || ytelseId === null || mulighet === null) {
    return skipToken;
  }

  return { ytelseId, fnr: mulighet.sakenGjelder.id };
};

const useSaksbehandler = (): ISaksbehandler | null => {
  const params = useSaksbehandlereParams();
  const { data } = useSaksbehandlere(params);
  const saksbehandlerIdent = useOverstyringerStore((state) => state.saksbehandlerIdent);

  return data?.saksbehandlere.find((saksbehandler) => saksbehandler.navIdent === saksbehandlerIdent) ?? null;
};

const NONE = 'NONE';

const Content = () => {
  const saksbehandler = useSaksbehandler();
  const params = useSaksbehandlereParams();
  const { data } = useSaksbehandlere(params);
  const { type, mulighet } = useAppStateStore();
  const ytelseId = useOverstyringerStore((state) => state.ytelseId);
  const saksbehandlerIdent = useOverstyringerStore((state) => state.saksbehandlerIdent);
  const setOverstyringer = useOverstyringerStore((state) => state.setOverstyringer);

  if (type === Type.NONE) {
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

  if (mulighet === null) {
    return (
      <Alert size="small" variant="info" inline>
        Velg mulighet først.
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
        onChange={(e) => setOverstyringer({ saksbehandlerIdent: e.target.value === NONE ? null : e.target.value })}
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
  const { type, mulighet } = useAppStateStore();

  if (type === Type.NONE) {
    return null;
  }

  return (
    <PartActionsContainer>
      <SetButton label="Fjern" title="Fjern" icon={<TrashIcon aria-hidden />} saksbehandlerIdent={null} />
      {type === Type.ANKE && mulighet.previousSaksbehandler !== null ? (
        <SetButton
          label="Fra klagen"
          title={mulighet.previousSaksbehandler.navn}
          saksbehandlerIdent={mulighet.previousSaksbehandler.navIdent}
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
  const type = useAppStateStore((state) => state.type);
  const selectedSaksbehandlerIdent = useOverstyringerStore((state) => state.saksbehandlerIdent);
  const setOverstyringer = useOverstyringerStore((state) => state.setOverstyringer);
  const params = useSaksbehandlereParams();
  const { data, isLoading } = useSaksbehandlere(params);

  if (
    type === Type.NONE ||
    isLoading ||
    selectedSaksbehandlerIdent === saksbehandlerIdent ||
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
      onClick={() => setOverstyringer({ saksbehandlerIdent })}
    >
      {label}
    </Button>
  );
};

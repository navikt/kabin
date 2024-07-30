import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
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
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetSaksbehandlerIdentMutation } from '@app/redux/api/overstyringer';
import { ISaksbehandlerParams, useSaksbehandlere } from '@app/simple-api-state/use-api';
import { ISaksbehandler, SaksTypeEnum } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

export const Tildeling = () => {
  const { overstyringer } = useRegistrering();
  const { saksbehandlerIdent } = overstyringer;
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
  const { typeId, mulighet } = useMulighet();
  const { overstyringer } = useRegistrering();
  const { ytelseId } = overstyringer;

  if (typeId === null || ytelseId === null || mulighet === undefined) {
    return skipToken;
  }

  return { ytelseId, fnr: mulighet.sakenGjelder.id };
};

const useSaksbehandler = (): ISaksbehandler | null => {
  const params = useSaksbehandlereParams();
  const { data } = useSaksbehandlere(params);
  const { overstyringer } = useRegistrering();
  const { saksbehandlerIdent } = overstyringer;

  return data?.saksbehandlere.find((saksbehandler) => saksbehandler.navIdent === saksbehandlerIdent) ?? null;
};

const NONE = 'NONE';

const Content = () => {
  const saksbehandler = useSaksbehandler();
  const params = useSaksbehandlereParams();
  const { data } = useSaksbehandlere(params);
  const { id, overstyringer } = useRegistrering();
  const { typeId, mulighet } = useMulighet();
  const { ytelseId, saksbehandlerIdent } = overstyringer;
  const [setSaksbehandlerIdent] = useSetSaksbehandlerIdentMutation();

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

  if (mulighet === undefined) {
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

const Actions = () => {
  const { typeId, mulighet } = useMulighet();

  if (typeId === null || mulighet === undefined) {
    return null;
  }

  return (
    <PartActionsContainer>
      <SetButton label="Fjern" title="Fjern" icon={<TrashIcon aria-hidden />} saksbehandlerIdent={null} />
      {typeId === SaksTypeEnum.ANKE && mulighet.previousSaksbehandler !== null ? (
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
  const { id, typeId, overstyringer } = useRegistrering();
  const selectedSaksbehandlerIdent = overstyringer.saksbehandlerIdent;
  const [setSaksbehandlerIdent] = useSetSaksbehandlerIdentMutation();
  const params = useSaksbehandlereParams();
  const { data, isLoading } = useSaksbehandlere(params);

  if (typeId === null || isLoading || selectedSaksbehandlerIdent === saksbehandlerIdent || data === undefined) {
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
      onClick={() => setSaksbehandlerIdent({ id, saksbehandlerIdent })}
    >
      {label}
    </Button>
  );
};

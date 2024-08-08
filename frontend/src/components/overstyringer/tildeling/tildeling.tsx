import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { StyledSaksbehandlerIcon } from '@app/components/overstyringer/icons';
import {
  PartActionsContainer,
  PartContent,
  PartTextContent,
  StyledContainer,
  getState,
} from '@app/components/overstyringer/styled-components';
import { Content, useSaksbehandler, useSaksbehandlereParams } from '@app/components/overstyringer/tildeling/content';
import { ReadOnlyText } from '@app/components/read-only-info/read-only-info';
import { ValidationErrorMessage } from '@app/components/validation-error-message/validation-error-message';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetSaksbehandlerIdentMutation } from '@app/redux/api/overstyringer/overstyringer';
import { useGetSaksbehandlereQuery } from '@app/redux/api/saksbehandlere';
import { SaksTypeEnum } from '@app/types/common';
import { ValidationFieldNames } from '@app/types/validation';

const ID = ValidationFieldNames.SAKSBEHANDLER;

export const Tildeling = () => {
  const { overstyringer } = useRegistrering();
  const { saksbehandlerIdent } = overstyringer;
  const canEdit = useCanEdit();
  const label = useFieldName(ID);
  const error = useValidationError(ID);
  const saksbehandler = useSaksbehandler();

  if (!canEdit) {
    return (
      <StyledContainer id={ValidationFieldNames.SAKSBEHANDLER} $state={getState(saksbehandlerIdent, error)}>
        <StyledSaksbehandlerIcon aria-hidden />
        <PartContent>
          <ReadOnlyText id={ID} label={label} value={saksbehandler?.navn ?? null} />
        </PartContent>
      </StyledContainer>
    );
  }

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
  const { data, isLoading } = useGetSaksbehandlereQuery(params);

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

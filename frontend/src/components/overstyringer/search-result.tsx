import { CompanyIcon, PersonIcon } from '@app/components/overstyringer/icons';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { getSakspartName } from '@app/domain/name';
import { formatId } from '@app/functions/format-id';
import { IdType, type IPart } from '@app/types/common';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, HStack, Loader, Tag, type TagProps, Tooltip, VStack } from '@navikt/ds-react';

interface Props {
  label: string;
  data: IPart | undefined | null;
  setPart: (part: IPart) => void;
  isLoading: boolean;
  dismiss?: () => void;
  searchString: string;
  isValid: boolean;
  isSaving: boolean;
}

export const SearchResult = ({ setPart, dismiss, data, isLoading, searchString, isValid, isSaving }: Props) => {
  if (isLoading) {
    return (
      <Render variant="alt3" isSaving={isSaving} onDismiss={dismiss}>
        <Loader size="medium" /> Søker...
      </Render>
    );
  }

  if (data !== undefined && data !== null) {
    return (
      <Render
        variant="alt3"
        onConfirm={() => setPart(data)}
        isSaving={isSaving}
        onDismiss={dismiss}
        statusList={data.statusList}
      >
        <Icon part={data} /> {getSakspartName(data)}
      </Render>
    );
  }

  if (searchString.length === 0) {
    return (
      <Render variant="alt3" isSaving={isSaving} onDismiss={dismiss}>
        Søk etter person eller virksomhet
      </Render>
    );
  }

  if (!isValid) {
    return (
      <Render variant="warning" isSaving={isSaving} onDismiss={dismiss}>
        Ugyldig ID-nummer
      </Render>
    );
  }

  return (
    <Render variant="warning" isSaving={isSaving} onDismiss={dismiss}>
      Ingen treff på &quot;{formatId(searchString)}&quot;
    </Render>
  );
};

interface RenderProps {
  variant: TagProps['variant'];
  statusList?: IPart['statusList'];
  children: React.ReactNode;
  onConfirm?: () => void;
  onDismiss?: () => void;
  isSaving: boolean;
}

const Render = ({ children, variant, statusList, onConfirm, onDismiss, isSaving }: RenderProps) => {
  const accept =
    onConfirm === undefined ? null : (
      <CustomButton
        onClick={onConfirm}
        icon={<CheckmarkIcon aria-hidden />}
        label="Bruk"
        keys={['enter']}
        variant="primary"
        disabled={isSaving}
        loading={isSaving}
      />
    );

  const dismiss =
    onDismiss === undefined ? null : (
      <CustomButton
        onClick={onDismiss}
        icon={<XMarkIcon aria-hidden />}
        label="Avbryt"
        keys={['esc']}
        variant="secondary-neutral"
      />
    );

  return (
    <VStack align="start" gap="space-8" style={{ gridArea: 'results' }}>
      <HStack gap="space-8" asChild wrap={false}>
        <Tag variant={variant} size="medium">
          {children}
        </Tag>
      </HStack>
      {statusList === undefined ? null : <PartStatusList statusList={statusList} />}
      <HStack justify="end" gap="space-8" wrap={false}>
        {accept}
        {dismiss}
      </HStack>
    </VStack>
  );
};

interface CustomButtonProps extends ButtonProps {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  keys: string[];
}

const CustomButton = ({ label, keys, ...props }: CustomButtonProps) => (
  <Tooltip content={label} keys={keys}>
    <Button {...props} size="small" title={label}>
      {label}
    </Button>
  </Tooltip>
);

interface IconProps {
  part: IPart | null;
}

const Icon = ({ part }: IconProps) => {
  if (part !== null && part.type === IdType.ORGNR) {
    return <CompanyIcon aria-hidden />;
  }

  return <PersonIcon aria-hidden />;
};

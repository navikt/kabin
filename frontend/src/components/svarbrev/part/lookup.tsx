import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
import { IdType, type IPart } from '@app/types/common';
import { BodyShort, Button, Loader, Tag, VStack } from '@navikt/ds-react';

interface LookupProps extends Omit<ResultProps, 'part'> {
  part: IPart | undefined;
  isSearching: boolean;
}

export const Lookup = ({ part, isSearching, ...rest }: LookupProps) => {
  if (isSearching) {
    return <Loader title="Laster..." />;
  }

  if (typeof part === 'undefined') {
    return null;
  }

  return <Result part={part} {...rest} />;
};

interface ResultProps {
  part: IPart;
  onChange: (part: IPart) => void;
  isLoading: boolean;
  buttonText?: string;
}

const Result = ({ part, isLoading, onChange, buttonText = 'Bruk' }: ResultProps) => (
  <VStack align="start" gap="space-8" asChild>
    <Tag variant={part.type === IdType.FNR ? 'info' : 'warning'} size="medium">
      <BodyShort>
        {part.name} (
        {part.type === IdType.FNR ? formatFoedselsnummer(part.identifikator) : formatOrgNum(part.identifikator)})
      </BodyShort>

      <PartStatusList statusList={part.statusList} />

      <Button data-color="neutral" onClick={() => onChange(part)} loading={isLoading} size="small" variant="secondary">
        {buttonText}
      </Button>
    </Tag>
  </VStack>
);

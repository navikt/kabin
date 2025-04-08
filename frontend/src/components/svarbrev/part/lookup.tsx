import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
import { type IPart, IdType } from '@app/types/common';
import { BodyShort, Button, Loader, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

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
  <StyledResult variant={part.type === IdType.FNR ? 'info' : 'warning'} size="medium">
    <BodyShort>
      {part.name} (
      {part.type === IdType.FNR ? formatFoedselsnummer(part.identifikator) : formatOrgNum(part.identifikator)})
    </BodyShort>

    <PartStatusList statusList={part.statusList} />

    <Button onClick={() => onChange(part)} loading={isLoading} size="small" variant="secondary">
      {buttonText}
    </Button>
  </StyledResult>
);

const StyledResult = styled(Tag)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;

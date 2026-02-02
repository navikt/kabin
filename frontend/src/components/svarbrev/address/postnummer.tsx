import { StaticDataContext } from '@app/components/app/static-data-context';
import { AddressField } from '@app/components/svarbrev/address/field';
import { Row } from '@app/components/svarbrev/address/layout';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { useContext, useId } from 'react';

interface Props {
  value: string | null;
  originalValue: string | null;
  onChange: (value: string | null) => void;
  error: boolean;
}

export const Postnummer = ({ value, originalValue, onChange, error }: Props) => {
  const poststedElementId = useId();

  const { getPoststed } = useContext(StaticDataContext);

  return (
    <Row>
      <AddressField
        id="postnummer"
        label="Postnummer"
        value={value}
        originalValue={originalValue}
        onChange={onChange}
        error={error}
        required
        maxLength={4}
        inputMode="numeric"
        pattern="^[0-9]{0,4}$"
        htmlSize={8}
      />
      <VStack gap="space-8" justify="start">
        <Label size="small" htmlFor={poststedElementId} className="flex min-h-6 items-center">
          Poststed
        </Label>
        <BodyShort size="medium" id={poststedElementId} className="flex h-8 items-center">
          {value === null ? 'Postnummer mangler' : (getPoststed(value) ?? 'Ukjent')}
        </BodyShort>
      </VStack>
    </Row>
  );
};

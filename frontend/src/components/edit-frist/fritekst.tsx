import { useRegistrering } from '@app/hooks/use-registrering';
import {
  useSetSvarbrevCustomTextMutation,
  useSetSvarbrevOverrideCustomTextMutation,
} from '@app/redux/api/svarbrev/svarbrev';
import { HStack, TextField, ToggleGroup } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

export const Fritekst = () => {
  const { id, svarbrev } = useRegistrering();
  const [value, setValue] = useState<string>(svarbrev.customText ?? '');
  const [override] = useSetSvarbrevOverrideCustomTextMutation();
  const [setCustomText] = useSetSvarbrevCustomTextMutation();

  useEffect(() => {
    if (!svarbrev.overrideCustomText) {
      return setValue('');
    }

    if (value === (svarbrev.customText ?? '')) {
      return;
    }

    const timer = setTimeout(() => {
      setCustomText({ id, customText: value });
    }, 500);

    return () => clearTimeout(timer);
  }, [id, setCustomText, svarbrev.customText, svarbrev.overrideCustomText, value]);

  return (
    <HStack gap="2" align="end">
      <ToggleGroup
        value={svarbrev.overrideCustomText ? 'true' : 'false'}
        onChange={(m) => override({ id, overrideCustomText: m === 'true' })}
        size="small"
        label="Overstyr fritekst om svartid"
      >
        <ToggleGroup.Item value="false" label="Uendret" />
        <ToggleGroup.Item value="true" label="Overstyr" />
      </ToggleGroup>

      <StyledFritekst
        size="small"
        label="Fritekst"
        disabled={!svarbrev.overrideCustomText}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
    </HStack>
  );
};

const StyledFritekst = styled(TextField)`
  flex-grow: 1;
`;

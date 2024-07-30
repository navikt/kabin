import { TextField, ToggleGroup } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useRegistreringId } from '@app/hooks/use-registrering-id';
import { useSetSvarbrevCustomTextMutation, useSetSvarbrevOverrideCustomTextMutation } from '@app/redux/api/svarbrev';

export const Fritekst = () => {
  const [override] = useSetSvarbrevOverrideCustomTextMutation();
  const [setCustomText] = useSetSvarbrevCustomTextMutation();
  const id = useRegistreringId();
  const registrering = useRegistrering();

  return (
    <>
      <ToggleGroup
        value={registrering.svarbrev.overrideCustomText ? 'true' : 'false'}
        onChange={(m) => override({ id, overrideCustomText: m === 'true' })}
        size="small"
        label="Overstyr fritekst"
      >
        <ToggleGroup.Item value="false" label="Uendret" />
        <ToggleGroup.Item value="true" label="Overstyr" />
      </ToggleGroup>

      <StyledFritekst
        size="small"
        label="Fritekst"
        disabled={registrering.svarbrev.overrideCustomText}
        value={registrering.svarbrev.customText ?? ''}
        onChange={({ target }) => setCustomText({ id, customText: target.value })}
      />
    </>
  );
};

const StyledFritekst = styled(TextField)`
  flex-grow: 1;
`;

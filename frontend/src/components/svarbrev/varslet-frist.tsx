import { Card } from '@app/components/card/card';
import { Fristdato } from '@app/components/edit-frist/calculated-fristdato';
import { useBehandlingstid, VarsletFristBehandlingstid } from '@app/components/svarbrev/edit-varslet-frist';
import { FIELD_NAMES } from '@app/hooks/use-field-name';
import { useRegistrering } from '@app/hooks/use-registrering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetSvarbrevReasonNoLetterMutation } from '@app/redux/api/svarbrev/svarbrev';
import type { SvarbrevSetting } from '@app/types/svarbrev-settings';
import { ValidationFieldNames } from '@app/types/validation';
import { HStack, Textarea, VStack } from '@navikt/ds-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  setting: SvarbrevSetting;
}

export const VarsletFrist = ({ setting }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [setReason] = useSetSvarbrevReasonNoLetterMutation();
  const { svarbrev, id } = useRegistrering();
  const [reason, setReasonValue] = useState(svarbrev.reasonNoLetter ?? '');
  const { units, unitTypeId } = useBehandlingstid(setting);
  const error = useValidationError(ValidationFieldNames.REASON_NO_LETTER);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (reason === (svarbrev.reasonNoLetter ?? '')) {
      return;
    }

    const timer = setTimeout(() => {
      setReason({ id, reasonNoLetter: reason });
    }, 500);

    return () => clearTimeout(timer);
  }, [id, reason, setReason, svarbrev.reasonNoLetter]);

  return (
    <Card>
      <VStack gap="space-16">
        <HStack gap="space-8" align="end">
          <VarsletFristBehandlingstid units={units} unitTypeId={unitTypeId} label="Varslet frist" />
          <Fristdato date={svarbrev.calculatedFrist} />
        </HStack>

        <Textarea
          ref={textAreaRef}
          label={FIELD_NAMES[ValidationFieldNames.REASON_NO_LETTER]}
          onChange={(e) => setReasonValue(e.target.value)}
          value={reason}
          size="small"
          id={ValidationFieldNames.REASON_NO_LETTER}
          error={error || localError}
          minRows={3}
          maxRows={3}
          onBlur={({ target }) => {
            if (target.value.trim() === '') {
              setLocalError('Oppgi hvorfor det ikke skal sendes noe svarbrev.');
            } else {
              setLocalError(null);
            }
          }}
        />
      </VStack>
    </Card>
  );
};

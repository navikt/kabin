import { Alert, Select, TextField } from '@navikt/ds-react';
import React, { useCallback, useEffect } from 'react';
import { styled } from 'styled-components';
import { Card } from '@app/components/card/card';
import { Preview } from '@app/components/svarbrev/preview/preview';
import { Receipients } from '@app/components/svarbrev/recipients';
import { PartRecipient } from '@app/components/svarbrev/types';
import { defaultString } from '@app/functions/empty-string';
import { useValidationError } from '@app/hooks/use-validation-error';
import { getValidSvarbrev } from '@app/pages/create/app-context/helpers';
import { DEFAULT_SVARBREV_NAME, IAnkeOverstyringer, IAnkeState, Svarbrev } from '@app/pages/create/app-context/types';
import { useInnsendingsenheter } from '@app/simple-api-state/use-kodeverk';
import { IAnkeMulighet } from '@app/types/mulighet';
import { ValidationFieldNames } from '@app/types/validation';

interface Props {
  mulighet: IAnkeMulighet;
  overstyringer: IAnkeOverstyringer;
  svarbrev: Svarbrev;
  journalpostId: string;
  suggestedRecipients: PartRecipient[];
  updateState: (state: Partial<IAnkeState>) => void;
}

export const InternalSvarbrevInput = ({
  svarbrev,
  mulighet,
  overstyringer,
  journalpostId,
  suggestedRecipients,
  updateState,
}: Props) => {
  const { data: enheter } = useInnsendingsenheter();

  const updateSvarbrev = useCallback(
    (update: Partial<Svarbrev>) => updateState({ svarbrev: { ...svarbrev, ...update } }),
    [svarbrev, updateState],
  );

  useEffect(() => {
    // Automatically add suggested recipients if there is only one and no recipients are added.
    if (suggestedRecipients.length === 1 && svarbrev.receivers.length === 0) {
      updateSvarbrev({ receivers: suggestedRecipients });
    }
  }, [suggestedRecipients, svarbrev.receivers, updateSvarbrev]);

  const error = useValidationError(ValidationFieldNames.ENHET);

  return (
    <>
      <Card title="Svarbrev">
        <Row>
          <TextField
            label="Dokumentnavn"
            htmlSize={45}
            size="small"
            placeholder={DEFAULT_SVARBREV_NAME}
            value={svarbrev.title}
            onBlur={({ target }) => updateSvarbrev({ title: defaultString(target.value, DEFAULT_SVARBREV_NAME) })}
            onChange={({ target }) => updateSvarbrev({ title: target.value })}
          />
          <TextField
            label="Navn på fullmektig i brevet"
            htmlSize={45}
            size="small"
            placeholder={overstyringer.fullmektig?.name ?? undefined}
            value={svarbrev.fullmektigFritekst ?? overstyringer.fullmektig?.name ?? ''}
            onBlur={({ target }) =>
              updateSvarbrev({
                fullmektigFritekst: defaultString(target.value, overstyringer.fullmektig?.name ?? null),
              })
            }
            onChange={({ target }) => updateSvarbrev({ fullmektigFritekst: target.value })}
            autoComplete="off"
          />
          <Select
            label="Enhet"
            size="small"
            value={svarbrev.enhetId ?? NONE}
            onChange={({ target }) => updateSvarbrev({ enhetId: target.value })}
            id={ValidationFieldNames.ENHET}
            error={error}
          >
            {svarbrev.enhetId === null ? <option value={NONE}>Velg enhet</option> : null}
            {enheter?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.navn}
              </option>
            ))}
          </Select>
        </Row>
        <Content>
          <Receipients
            recipients={svarbrev.receivers}
            setRecipients={(receivers) => updateSvarbrev({ receivers })}
            suggestedRecipients={suggestedRecipients}
          />
        </Content>
      </Card>
      <Card title="Forhåndsvisning av svarbrev">
        {svarbrev !== null && getValidSvarbrev(svarbrev) ? (
          <Preview
            mulighet={mulighet}
            overstyringer={overstyringer}
            svarbrev={svarbrev}
            journalpostId={journalpostId}
          />
        ) : (
          <Alert variant="info" size="small">
            Velg enhet for å se forhåndsvisning.
          </Alert>
        )}
      </Card>
    </>
  );
};

const NONE = 'NONE';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  justify-content: space-between;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

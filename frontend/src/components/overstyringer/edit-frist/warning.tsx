import { Alert } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { AppContext } from '@app/pages/create/app-context/app-context';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';

export const Warning = () => {
  const { state } = useContext(AppContext);

  if (
    state === null ||
    state.svarbrev.varsletBehandlingstidUnits === null ||
    state.svarbrev.varsletBehandlingstidUnitType === null
  ) {
    return null;
  }

  if (
    (state.svarbrev.varsletBehandlingstidUnitType === BehandlingstidUnitType.WEEKS &&
      state.svarbrev.varsletBehandlingstidUnits > 52) ||
    (state.svarbrev.varsletBehandlingstidUnitType === BehandlingstidUnitType.MONTHS &&
      state.svarbrev.varsletBehandlingstidUnits > 12)
  ) {
    return (
      <Alert size="small" variant="warning">
        Behandlingstiden er <b>over ett år</b>. Er du sikker på at dette er riktig?
      </Alert>
    );
  }
};

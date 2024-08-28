import type { Registrering } from '@app/redux/api/registreringer/types';

export const setRegistreringFn = (draft: Registrering[], data: Registrering) => {
  for (let i = draft.length - 1; i >= 0; i--) {
    const d = draft[i]!;

    if (d.id === data.id) {
      draft[i] = data;

      return;
    }
  }

  draft.push(data);
};

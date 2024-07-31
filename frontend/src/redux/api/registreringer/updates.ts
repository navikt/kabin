import { setRegistreringFn } from '@app/redux/api/registreringer/helpers';
import { queriesSlice } from '@app/redux/api/registreringer/queries';
import {
  DraftRegistrering,
  FinishedRegistrering,
  FinishingRegistrering,
  Overstyringer,
  Registrering,
  Svarbrev,
} from '@app/redux/api/registreringer/types';
import { reduxStore } from '@app/redux/configure-store';

export type UpdateFn<T extends Registrering = DraftRegistrering, R extends Registrering = T> = (draft: T) => R;

// All drafts

export const updateDrafts = (id: string, update: UpdateFn<DraftRegistrering>): (() => void) => {
  const patchResult = updateRegistrering(id, (draft) => (draft.finished === null ? update(draft) : draft));
  const unfinishedPatchResult = updateUferdigRegistrering(id, update);

  return () => {
    patchResult.undo();
    unfinishedPatchResult.undo();
  };
};

// Registrering

export const updateRegistrering = (id: string, update: UpdateFn<Registrering>) =>
  reduxStore.dispatch(queriesSlice.util.updateQueryData('getRegistrering', id, update));

export const setRegistrering = (id: string, data: Registrering | undefined) =>
  reduxStore.dispatch(queriesSlice.util.updateQueryData('getRegistrering', id, () => data));

// Uferdig registrering

export const setUferdigRegistrering = (data: DraftRegistrering) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
      setRegistreringFn(draft, data),
    ),
  );

const updateUferdigRegistrering = (id: string, update: UpdateFn) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
      draft.map((d) => (d.id === id ? update(d) : d)),
    ),
  );

export const removeUferdigRegistrering = (id: string) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getUferdigeRegistreringer', undefined, (draft) =>
      draft.filter((d) => d.id !== id),
    ),
  );

// Ferdig registrering

export const updateFerdigRegistrering = (
  id: string,
  update: UpdateFn<FinishedRegistrering | FinishingRegistrering, FinishedRegistrering | FinishingRegistrering>,
) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getFerdigeRegistreringer', undefined, (draft) =>
      draft.map((d) => (d.id === id ? update(d) : d)),
    ),
  );

export const removeFerdigRegistrering = (id: string) =>
  reduxStore.dispatch(
    queriesSlice.util.updateQueryData('getFerdigeRegistreringer', undefined, (draft) =>
      draft.filter((d) => d.id !== id),
    ),
  );

export const pessimisticOverstyringerUpdate = (
  id: string,
  modified: string,
  overstyringer: Partial<Overstyringer>,
  svarbrev: Partial<Svarbrev> = {},
) =>
  updateDrafts(id, (draft) => ({
    ...draft,
    overstyringer: { ...draft.overstyringer, ...overstyringer },
    svarbrev: { ...draft.svarbrev, ...svarbrev },
    modified,
  }));

// reduxStore.dispatch(
//   queriesSlice.util.updateQueryData('getRegistrering', id, (draft) => {
//     if (isDraftRegistrering(draft)) {
//       return {
//         ...draft,
//         overstyringer: { ...draft.overstyringer, ...overstyringer },
//         svarbrev: { ...draft.svarbrev, ...svarbrev },
//         modified,
//       };
//     }

//     return draft;
//   }),
// );

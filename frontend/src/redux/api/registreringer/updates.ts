import { setRegistreringFn } from '@app/redux/api/registreringer/helpers';
import { queriesSlice } from '@app/redux/api/registreringer/queries';
import { RegistreringTagType } from '@app/redux/api/registreringer/registrering';
import {
  DraftRegistrering,
  FinishedRegistrering,
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

export const removeRegistrering = (id: string) =>
  reduxStore.dispatch(queriesSlice.util.invalidateTags([{ id, type: RegistreringTagType.REGISTRERING }]));

export const setRegistrering = (id: string, data: Registrering) =>
  reduxStore.dispatch(queriesSlice.util.upsertQueryData('getRegistrering', id, data));

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

export const updateFerdigRegistrering = (id: string, update: UpdateFn<FinishedRegistrering, FinishedRegistrering>) =>
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

interface PartialDraftRegistrering extends Partial<Omit<DraftRegistrering, 'overstyringer' | 'svarbrev'>> {
  overstyringer?: Partial<Overstyringer>;
  svarbrev?: Partial<Svarbrev>;
}

export const pessimisticUpdate = (id: string, response: PartialDraftRegistrering = {}) =>
  updateDrafts(id, (draft) => ({
    ...draft,
    ...response,
    overstyringer: { ...draft.overstyringer, ...response.overstyringer },
    svarbrev: { ...draft.svarbrev, ...response.svarbrev },
  }));

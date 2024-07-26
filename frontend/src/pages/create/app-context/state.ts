import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  DEFAULT_SVARBREV_NAME,
  IAnkeOverstyringer,
  IKlageOverstyringer,
  Recipient,
  Svarbrev,
  Type,
  UpdateErrorsFn,
} from '@app/pages/create/app-context/types';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';
import { IPart } from '@app/types/common';
import { IArkivertDocument } from '@app/types/dokument';
import { IAnkeMulighet, IKlagemulighet } from '@app/types/mulighet';
import { IValidationSection } from '@app/types/validation';

type SetFn<T> = (value: T) => T;
type Setter<T> = (value: T | SetFn<T>) => void;

interface BaseAppState {
  setType: Setter<Type>;
  journalpost: IArkivertDocument | null;
  setJournalpost: (journalpost: IArkivertDocument | null) => void;
  sendSvarbrev: boolean;
  setSendSvarbrev: (sendSvarbrev: boolean) => void;

  errors: IValidationSection[] | null;
  setErrors: (errors: IValidationSection[] | null | UpdateErrorsFn) => void;
}

interface NoneAppState extends BaseAppState {
  type: Type.NONE;
  mulighet: null;
  setMulighet: (klagemulighet: null) => void;
}

interface KlageAppState extends BaseAppState {
  type: Type.KLAGE;
  mulighet: IKlagemulighet;
  setMulighet: (klagemulighet: IKlagemulighet | null) => void;
}

interface AnkeAppState extends BaseAppState {
  type: Type.ANKE;
  mulighet: IAnkeMulighet;
  setMulighet: (klagemulighet: IAnkeMulighet | null) => void;
}

interface SvarbrevState extends Svarbrev {
  setTitle: (title: string) => void;
  setVarsletBehandlingstidUnits: (varsletBehandlingstidUnits: number | null) => void;
  setVarsletBehandlingstidUnitTypeId: (varsletBehandlingstidUnitTypeId: BehandlingstidUnitType | null) => void;
  setCustomText: (customText: string | null) => void;
  setFullmektigFritekst: (fullmektigFritekst: string | null) => void;
  setReceivers: (receivers: Recipient[]) => void;
}

export const useAppStateStore = create<NoneAppState | KlageAppState | AnkeAppState>()(
  devtools((set) => ({
    type: Type.NONE,
    setType: (type) =>
      set((state) => {
        typeof type === 'function' ? type(state.type) : type;
      }),
    mulighet: null,
    setMulighet: (mulighet) => set({ mulighet }),
    sendSvarbrev: true,
    setSendSvarbrev: (sendSvarbrev) => set({ sendSvarbrev }),
    errors: null,
    setErrors: (errors) => set((state) => (typeof errors === 'function' ? errors(state.errors) : errors)),
  })),
);

interface OverstyringerStore extends IKlageOverstyringer, IAnkeOverstyringer {
  setMottattVedtaksinstans: (mottattVedtaksinstans: string | null) => void;
  setMottattKlageinstans: (mottattKlageinstans: string | null) => void;
  setBehandlingstidUnits: (behandlingstidUnits: number) => void;
  setBehandlingstidUnitTypeId: (behandlingstidUnitTypeId: BehandlingstidUnitType) => void;
  setHjemmelIdList: (hjemmelIdList: string[]) => void;
  setYtelseId: (ytelseId: string | null) => void;
  setFullmektig: (fullmektig: IPart | null) => void;
  setKlager: (klager: IPart | null) => void;
  setAvsender: (avsender: IPart | null) => void;
  setSaksbehandlerIdent: (saksbehandlerIdent: string | null) => void;
  setOppgaveId: (oppgaveId: number | null) => void;
  setOverstyringer: (overstyringer: Partial<IKlageOverstyringer & IAnkeOverstyringer>) => void;
}

export const useOverstyringerStore = create<OverstyringerStore>()(
  devtools((set) => ({
    mottattVedtaksinstans: null,
    setMottattVedtaksinstans: (mottattVedtaksinstans) => set({ mottattVedtaksinstans }),
    mottattKlageinstans: null,
    setMottattKlageinstans: (mottattKlageinstans) => set({ mottattKlageinstans }),
    behandlingstidUnits: 12,
    setBehandlingstidUnits: (behandlingstidUnits) => set({ behandlingstidUnits }),
    behandlingstidUnitTypeId: BehandlingstidUnitType.WEEKS,
    setBehandlingstidUnitTypeId: (behandlingstidUnitTypeId) => set({ behandlingstidUnitTypeId }),
    hjemmelIdList: [],
    setHjemmelIdList: (hjemmelIdList) => set({ hjemmelIdList }),
    ytelseId: null,
    setYtelseId: (ytelseId) => set({ ytelseId }),
    fullmektig: null,
    setFullmektig: (fullmektig) => set({ fullmektig }),
    klager: null,
    setKlager: (klager) => set({ klager }),
    avsender: null,
    setAvsender: (avsender) => set({ avsender }),
    saksbehandlerIdent: null,
    setSaksbehandlerIdent: (saksbehandlerIdent) => set({ saksbehandlerIdent }),
    oppgaveId: null,
    setOppgaveId: (oppgaveId) => set({ oppgaveId }),
    setOverstyringer: (overstyringer) => set({ ...overstyringer }),
  })),
);

export const useSvarbrevStore = create<SvarbrevState>()(
  devtools((set) => ({
    title: DEFAULT_SVARBREV_NAME,
    varsletBehandlingstidUnits: null,
    varsletBehandlingstidUnitTypeId: null,
    customText: null,
    fullmektigFritekst: null,
    receivers: [],
    setTitle: (title) => set({ title }),
    setVarsletBehandlingstidUnits: (varsletBehandlingstidUnits) => set({ varsletBehandlingstidUnits }),
    setVarsletBehandlingstidUnitTypeId: (varsletBehandlingstidUnitTypeId) => set({ varsletBehandlingstidUnitTypeId }),
    setCustomText: (customText) => set({ customText }),
    setFullmektigFritekst: (fullmektigFritekst) => set({ fullmektigFritekst }),
    setReceivers: (receivers) => set({ receivers }),
    fetchSvarbrevSetting: async () => {
      // const response = await fetch('/api/svarbrev');
      // const data = await response.json();
      // set({ ...data });
    },
  })),
);

// useKlagemulighetStore.getState().klagemulighet;

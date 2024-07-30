import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DEFAULT_SVARBREV_NAME, Recipient, Svarbrev } from '@app/pages/create/app-context/types';
import { BehandlingstidUnitType } from '@app/types/calculate-frist';

interface SvarbrevState extends Svarbrev {
  setTitle: (title: string) => void;
  setVarsletBehandlingstidUnits: (varsletBehandlingstidUnits: number | null) => void;
  setVarsletBehandlingstidUnitTypeId: (varsletBehandlingstidUnitTypeId: BehandlingstidUnitType | null) => void;
  setCustomText: (customText: string | null) => void;
  setFullmektigFritekst: (fullmektigFritekst: string | null) => void;
  setReceivers: (receivers: Recipient[]) => void;
}

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

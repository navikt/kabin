import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IBehandling } from '../../types/behandling';
import { IPart, skipToken } from '../../types/common';
import { getCreatePayload } from '../../types/create';
import { IArkivertDocument } from '../../types/dokument';
import { ApiContext } from './api-context';

interface IAnkeContext {
  fnr: string | typeof skipToken;
  ankemulighet: IBehandling | null;
  dokument: IArkivertDocument | null;
  klager: IPart | null;
  fullmektig: IPart | null;
  mottattNav: string; // Date
  fristInWeeks: number; // Number of weeks
  setAnkemulighet: (value: IBehandling) => void;
  setDokument: (value: IArkivertDocument) => void;
  setKlager: (value: IPart | null) => void;
  setFullmektig: (value: IPart | null) => void;
  setMottattNav: (value: string) => void;
  setFristInWeeks: (value: number) => void;
}

const noop = () => {
  /* No operation */
};

export const AnkeContext = createContext<IAnkeContext>({
  fnr: skipToken,
  ankemulighet: null,
  klager: null,
  fullmektig: null,
  mottattNav: '',
  fristInWeeks: 12,
  dokument: null,
  setDokument: noop,
  setKlager: noop,
  setFullmektig: noop,
  setAnkemulighet: noop,
  setMottattNav: noop,
  setFristInWeeks: noop,
});

interface Props {
  children: React.ReactNode;
  fnr: string | typeof skipToken;
  defaultDokument: IArkivertDocument;
  defaultAnkemulighet: IBehandling;
}

export const AnkeContextState = ({ fnr, defaultDokument, defaultAnkemulighet, children }: Props) => {
  const { setPayload } = useContext(ApiContext);
  const [ankemulighet, setInternalAnkemulighet] = useState<IBehandling>(defaultAnkemulighet);
  const [dokument, setInternalDokument] = useState<IArkivertDocument>(defaultDokument);
  const [klager, setInternalKlager] = useState<IPart>(defaultAnkemulighet.klager);
  const [fullmektig, setFullmektig] = useState<IPart | null>(null);
  const [mottattNav, setMottattNav] = useState<string>(defaultDokument.registrert);
  const [fristInWeeks, setFristInWeeks] = useState<number>(12);

  const klagebehandlingId = ankemulighet.behandlingId;
  const ankeDocumentJournalpostId = dokument.journalpostId;

  useEffect(() => {
    const payload = getCreatePayload({
      klagebehandlingId,
      ankeDocumentJournalpostId,
      mottattNav,
      fristInWeeks,
      klager,
      fullmektig,
    });
    setPayload(payload);
  }, [mottattNav, klager, fullmektig, setPayload, klagebehandlingId, ankeDocumentJournalpostId, fristInWeeks]);

  const setKlager = useCallback(
    (newKlager: IPart | null) => setInternalKlager(newKlager ?? ankemulighet.klager),
    [ankemulighet.klager]
  );

  const setAnkemulighet = useCallback(
    (newAnkemulighet: IBehandling) => {
      setInternalAnkemulighet(newAnkemulighet);
      setKlager(newAnkemulighet.klager);
    },
    [setKlager]
  );

  const setDokument = useCallback((newDokument: IArkivertDocument) => {
    setInternalDokument(newDokument);
    setMottattNav(newDokument.registrert);
  }, []);

  const ankeContext: IAnkeContext = {
    fnr,
    ankemulighet,
    setAnkemulighet,
    klager,
    setKlager,
    fullmektig,
    setFullmektig,
    mottattNav,
    setMottattNav,
    fristInWeeks,
    setFristInWeeks,
    dokument,
    setDokument,
  };

  return <AnkeContext.Provider value={ankeContext}>{children}</AnkeContext.Provider>;
};

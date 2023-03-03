import React, { createContext, useContext, useEffect, useState } from 'react';
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
  mottattNav: string | null; // Date
  fristInWeeks: number; // Number of weeks
  setAnkemulighet: (value: IBehandling | null) => void;
  setDokument: (value: IArkivertDocument | null) => void;
  setKlager: (value: IPart | null) => void;
  setFullmektig: (value: IPart | null) => void;
  setMottattNav: (value: string | null) => void;
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
}

export const AnkeContextState = ({ fnr, children }: Props) => {
  const { setPayload } = useContext(ApiContext);
  const [ankemulighet, setAnkemulighet] = useState<IBehandling | null>(null);
  const [journalpost, setDokument] = useState<IArkivertDocument | null>(null);
  const [klager, setKlager] = useState<IPart | null>(null);
  const [fullmektig, setFullmektig] = useState<IPart | null>(null);
  const [mottattNav, setMottattNav] = useState<string | null>(null);
  const [fristInWeeks, setFristInWeeks] = useState<number>(12);

  useEffect(() => {
    const payload = getCreatePayload({
      journalpost,
      ankemulighet,
      mottattNav,
      fristInWeeks,
      klager,
      fullmektig,
    });
    setPayload(payload);
  }, [mottattNav, klager, fullmektig, setPayload, fristInWeeks, journalpost, ankemulighet]);

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
    dokument: journalpost,
    setDokument,
  };

  return <AnkeContext.Provider value={ankeContext}>{children}</AnkeContext.Provider>;
};

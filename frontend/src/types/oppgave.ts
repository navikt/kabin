export interface IOppgave {
  id: number;
  temaId: string;
  tildeltEnhetsnr: string | null;
  endretAvEnhetsnr: string | null;
  endretAv: string | null;
  endretTidspunkt: string | null;
  opprettetAvEnhetsnr: string | null;
  opprettetAv: string | null;
  opprettetTidspunkt: string | null;
  beskrivelse: string | null;
  gjelder: string | null;
  oppgavetype: string | null;
  tilordnetRessurs: string | null;
  fristFerdigstillelse: string | null;
  alreadyUsed: boolean;
}

import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { getSvarbrevSettings } from '@app/components/edit-frist/get-svarbrev-settings';
import { PDF_ASPECT_RATIO } from '@app/components/svarbrev/preview/constants';
import { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import { PDF_MANAGER } from '@app/components/svarbrev/preview/pdf-manager';
import { RenderPdf } from '@app/components/svarbrev/preview/pdf-render';
import { defaultString } from '@app/functions/empty-string';
import { useAppStateStore, useOverstyringerStore, useSvarbrevStore } from '@app/pages/create/app-context/state';
import { DEFAULT_SVARBREV_NAME, TYPE_TO_SAKSTYPE, Type } from '@app/pages/create/app-context/types';
import { useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';

export const Preview = () => {
  const loaders = useUrl();

  const rendered: PdfLoader[] = [];

  for (let i = loaders.length - 1; i >= 0; i--) {
    const current = loaders[i]!;

    rendered.push(current);

    if (current.url !== null && rendered.length > 1) {
      break;
    }
  }

  return (
    <PdfContainer>
      {rendered.toReversed().map((loader) => (
        <RenderPdf key={loader.key} loader={loader} />
      ))}
    </PdfContainer>
  );
};

const PdfContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${PDF_ASPECT_RATIO};
  background-color: white;
`;

const useUrl = () => {
  const { type, mulighet } = useAppStateStore();
  const selectedYtelseId = useOverstyringerStore((state) => state.ytelseId);
  const mottattKlageinstans = useOverstyringerStore((state) => state.mottattKlageinstans);
  const fullmektig = useOverstyringerStore((state) => state.fullmektig);
  const klager = useOverstyringerStore((state) => state.klager);
  const svarbrev = useSvarbrevStore();
  const { data: svarbrevSettings } = useSvarbrevSettings(selectedYtelseId ?? skipToken);

  const [loaders, setLoaders] = useState<PdfLoader[]>([]);

  const ytelseId: string | null =
    (type === Type.ANKE ? (selectedYtelseId ?? mulighet?.ytelseId) : selectedYtelseId) ?? null;

  const settings = getSvarbrevSettings(svarbrevSettings, type);

  useEffect(() => {
    if (
      mottattKlageinstans === null ||
      ytelseId === null ||
      type === Type.NONE ||
      settings === null ||
      mulighet === null
    ) {
      return;
    }

    const timeout = setTimeout(async () => {
      const loader = PDF_MANAGER.load({
        varsletBehandlingstidUnits: svarbrev.varsletBehandlingstidUnits ?? settings.behandlingstidUnits,
        varsletBehandlingstidUnitTypeId: svarbrev.varsletBehandlingstidUnitTypeId ?? settings.behandlingstidUnitTypeId,
        fullmektigFritekst: defaultString(svarbrev.fullmektigFritekst, fullmektig?.name ?? null),
        title: defaultString(svarbrev.title, DEFAULT_SVARBREV_NAME),
        customText: svarbrev.customText,
        typeId: TYPE_TO_SAKSTYPE[type],
        klager: klager?.id ?? null,
        sakenGjelder: mulighet.sakenGjelder.id,
        ytelseId,
        mottattKlageinstans,
      });

      setLoaders((loaderList) =>
        loaderList.includes(loader) ? [...loaderList.filter((l) => l !== loader), loader] : [...loaderList, loader],
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    fullmektig?.name,
    klager?.id,
    mottattKlageinstans,
    mulighet,
    mulighet?.sakenGjelder.id,
    settings,
    svarbrev.customText,
    svarbrev.fullmektigFritekst,
    svarbrev.title,
    svarbrev.varsletBehandlingstidUnitTypeId,
    svarbrev.varsletBehandlingstidUnits,
    type,
    ytelseId,
  ]);

  useEffect(() => () => PDF_MANAGER.clear(), []);

  return loaders;
};

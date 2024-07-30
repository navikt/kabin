import { skipToken } from '@reduxjs/toolkit/query/react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { getSvarbrevSettings } from '@app/components/edit-frist/get-svarbrev-settings';
import { PDF_ASPECT_RATIO } from '@app/components/svarbrev/preview/constants';
import { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import { PDF_MANAGER } from '@app/components/svarbrev/preview/pdf-manager';
import { RenderPdf } from '@app/components/svarbrev/preview/pdf-render';
import { defaultString } from '@app/functions/empty-string';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { DEFAULT_SVARBREV_NAME, TYPE_TO_SAKSTYPE } from '@app/pages/create/app-context/types';
import { useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { SaksTypeEnum } from '@app/types/common';

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
  const { svarbrev, overstyringer } = useRegistrering();
  const { typeId, mulighet } = useMulighet();

  const selectedYtelseId = overstyringer.ytelseId;
  const { mottattKlageinstans, fullmektig, klager } = overstyringer;

  const { data: svarbrevSettings } = useSvarbrevSettings(selectedYtelseId ?? skipToken);

  const [loaders, setLoaders] = useState<PdfLoader[]>([]);

  const ytelseId: string | null =
    (typeId === SaksTypeEnum.ANKE ? (selectedYtelseId ?? mulighet?.ytelseId) : selectedYtelseId) ?? null;

  const settings = getSvarbrevSettings(svarbrevSettings, typeId);

  useEffect(() => {
    if (
      mottattKlageinstans === null ||
      ytelseId === null ||
      typeId === null ||
      settings === null ||
      mulighet === undefined
    ) {
      return;
    }

    const timeout = setTimeout(async () => {
      const loader = PDF_MANAGER.load({
        varsletBehandlingstidUnits: svarbrev.behandlingstid?.units ?? settings.behandlingstidUnits,
        varsletBehandlingstidUnitTypeId: svarbrev.behandlingstid?.unitType ?? settings.behandlingstidUnitTypeId,
        fullmektigFritekst: defaultString(svarbrev.fullmektigFritekst, fullmektig?.name ?? null),
        title: defaultString(svarbrev.title, DEFAULT_SVARBREV_NAME),
        customText: svarbrev.customText,
        typeId: TYPE_TO_SAKSTYPE[typeId],
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
  }, [fullmektig?.name, klager?.id, mottattKlageinstans, mulighet, settings, svarbrev, typeId, ytelseId]);

  useEffect(() => () => PDF_MANAGER.clear(), []);

  return loaders;
};

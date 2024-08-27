import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { PDF_ASPECT_RATIO } from '@app/components/svarbrev/preview/constants';
import { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import { PDF_MANAGER } from '@app/components/svarbrev/preview/pdf-manager';
import { RenderPdf } from '@app/components/svarbrev/preview/pdf-render';
import { defaultString } from '@app/functions/empty-string';
import { useMulighet } from '@app/hooks/use-mulighet';
import { useRegistrering } from '@app/hooks/use-registrering';
import { DEFAULT_SVARBREV_NAME } from '@app/redux/api/svarbrev/svarbrev';
import { useGetSvarbrevSettingQuery } from '@app/redux/api/svarbrev-settings';
import { SaksTypeEnum } from '@app/types/common';

export const Preview = () => {
  const { overstyringer } = useRegistrering();
  const loaders = useUrl();

  if (overstyringer.mottattKlageinstans === null) {
    return (
      <Alert variant="info" size="small" inline>
        Velg mottatt klageinstans først.
      </Alert>
    );
  }

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

  const { data: svarbrevSetting } = useGetSvarbrevSettingQuery(
    typeId === null || selectedYtelseId === null ? skipToken : { ytelseId: selectedYtelseId, typeId },
  );

  const [loaders, setLoaders] = useState<PdfLoader[]>([]);

  const ytelseId: string | null =
    (typeId === SaksTypeEnum.ANKE ? (selectedYtelseId ?? mulighet?.ytelseId) : selectedYtelseId) ?? null;

  useEffect(() => {
    if (
      mottattKlageinstans === null ||
      ytelseId === null ||
      typeId === null ||
      svarbrevSetting === undefined ||
      mulighet === undefined
    ) {
      return;
    }

    const timeout = setTimeout(async () => {
      const loader = PDF_MANAGER.load({
        varsletBehandlingstidUnits: svarbrev.behandlingstid?.units ?? svarbrevSetting.behandlingstidUnits,
        varsletBehandlingstidUnitTypeId:
          svarbrev.behandlingstid?.unitTypeId ?? svarbrevSetting.behandlingstidUnitTypeId,
        fullmektigFritekst: defaultString(svarbrev.fullmektigFritekst, fullmektig?.name ?? null),
        title: svarbrev.title ?? DEFAULT_SVARBREV_NAME,
        customText: svarbrev.customText,
        typeId,
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
  }, [fullmektig?.name, klager?.id, mottattKlageinstans, mulighet, svarbrevSetting, svarbrev, typeId, ytelseId]);

  useEffect(() => () => PDF_MANAGER.clear(), []);

  return loaders;
};

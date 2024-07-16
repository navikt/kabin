import React, { useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { getSvarbrevSettings } from '@app/components/overstyringer/edit-frist/get-svarbrev-settings';
import { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import { PDF_MANAGER } from '@app/components/svarbrev/preview/pdf-manager';
import { RenderPdf } from '@app/components/svarbrev/preview/pdf-render';
import { PDF_ASPECT_RATIO } from '@app/components/toast/constants';
import { defaultString } from '@app/functions/empty-string';
import { AppContext } from '@app/pages/create/app-context/app-context';
import {
  DEFAULT_SVARBREV_NAME,
  IAnkeOverstyringer,
  Svarbrev,
  TYPE_TO_SAKSTYPE,
  Type,
} from '@app/pages/create/app-context/types';
import { useSvarbrevSettings } from '@app/simple-api-state/use-api';
import { skipToken } from '@app/types/common';
import { IAnkeMulighet } from '@app/types/mulighet';

interface Props {
  mulighet: IAnkeMulighet;
  overstyringer: IAnkeOverstyringer;
  svarbrev: Svarbrev;
  journalpostId: string;
}

export const Preview = (props: Props) => {
  const loaders = useUrl(props);

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

const useUrl = ({ mulighet, overstyringer, svarbrev }: Props) => {
  const { type } = useContext(AppContext);
  const { data: svarbrevSettings } = useSvarbrevSettings(overstyringer.ytelseId ?? skipToken);

  const [loaders, setLoaders] = useState<PdfLoader[]>([]);

  const ytelseId = overstyringer.ytelseId ?? mulighet.ytelseId;

  const settings = getSvarbrevSettings(svarbrevSettings, type);

  useEffect(() => {
    const mk = overstyringer.mottattKlageinstans;

    if (mk === null || ytelseId === null || type === Type.NONE || settings === null) {
      return;
    }

    const timeout = setTimeout(async () => {
      const loader = PDF_MANAGER.load({
        varsletBehandlingstidUnits: svarbrev.varsletBehandlingstidUnits ?? settings.behandlingstidUnits,
        varsletBehandlingstidUnitType: svarbrev.varsletBehandlingstidUnitType ?? settings.behandlingstidUnitType,
        fullmektigFritekst: defaultString(svarbrev.fullmektigFritekst, overstyringer.fullmektig?.name ?? null),
        title: defaultString(svarbrev.title, DEFAULT_SVARBREV_NAME),
        customText: svarbrev.customText,
        typeId: TYPE_TO_SAKSTYPE[type],
        klager: overstyringer.klager?.id ?? null,
        sakenGjelder: mulighet.sakenGjelder.id,
        ytelseId,
        mottattKlageinstans: mk,
      });

      setLoaders((loaderList) =>
        loaderList.includes(loader) ? [...loaderList.filter((l) => l !== loader), loader] : [...loaderList, loader],
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    mulighet.sakenGjelder.id,
    overstyringer.fullmektig?.name,
    overstyringer.klager?.id,
    overstyringer.mottattKlageinstans,
    settings,
    svarbrev.customText,
    svarbrev.fullmektigFritekst,
    svarbrev.title,
    svarbrev.varsletBehandlingstidUnitType,
    svarbrev.varsletBehandlingstidUnits,
    type,
    ytelseId,
  ]);

  useEffect(() => () => PDF_MANAGER.clear(), []);

  return loaders;
};

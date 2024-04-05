import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { PdfLoader } from '@app/components/svarbrev/preview/pdf-loader';
import { PDF_MANAGER } from '@app/components/svarbrev/preview/pdf-manager';
import { RenderPdf } from '@app/components/svarbrev/preview/pdf-render';
import { PDF_ASPECT_RATIO } from '@app/components/toast/constants';
import { partToPartId } from '@app/domain/converters';
import { defaultString } from '@app/functions/empty-string';
import { DEFAULT_SVARBREV_NAME, IAnkeOverstyringer, ValidSvarbrev } from '@app/pages/create/app-context/types';
import { IAnkeMulighet } from '@app/types/mulighet';

interface Props {
  mulighet: IAnkeMulighet;
  overstyringer: IAnkeOverstyringer;
  svarbrev: ValidSvarbrev;
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
      {rendered.toReversed().map((loader) => {
        // eslint-disable-next-line no-console
        console.log('Loader:', loader);

        return <RenderPdf key={loader.key} loader={loader} />;
      })}
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
  const [loaders, setLoaders] = useState<PdfLoader[]>([]);

  const ytelseId = overstyringer.ytelseId ?? mulighet.ytelseId;

  useEffect(() => {
    const mk = overstyringer.mottattKlageinstans;

    if (mk === null || ytelseId === null) {
      return;
    }

    const timeout = setTimeout(async () => {
      const loader = PDF_MANAGER.load({
        mottattKlageinstans: mk,
        ytelseId,
        sakenGjelder: {
          id: mulighet.sakenGjelder.id,
          type: mulighet.sakenGjelder.type,
        },
        klager: partToPartId(overstyringer.klager),
        fristInWeeks: overstyringer.fristInWeeks,
        svarbrevInput: {
          enhetId: svarbrev.enhetId,
          fullmektigFritekst: defaultString(svarbrev.fullmektigFritekst, overstyringer.fullmektig?.name ?? null),
          title: defaultString(svarbrev.title, DEFAULT_SVARBREV_NAME),
        },
      });

      setLoaders((loaderList) =>
        loaderList.includes(loader) ? [...loaderList.filter((l) => l !== loader), loader] : [...loaderList, loader],
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    mulighet.sakenGjelder.id,
    mulighet.sakenGjelder.type,
    overstyringer.fristInWeeks,
    overstyringer.fullmektig?.name,
    overstyringer.klager,
    overstyringer.mottattKlageinstans,
    svarbrev.enhetId,
    svarbrev.fullmektigFritekst,
    svarbrev.title,
    ytelseId,
  ]);

  useEffect(() => () => PDF_MANAGER.clear(), []);

  return loaders;
};

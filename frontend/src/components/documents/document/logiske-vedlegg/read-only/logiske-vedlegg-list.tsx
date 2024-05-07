import React from 'react';
import { ReadOnlyLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logisk-vedlegg';
import {
  LogiskeVedleggList,
  LogiskeVedleggListItem,
  NoAttachmentsText,
  StyleProps,
} from '@app/components/documents/document/logiske-vedlegg/shared/list-style';
import { LogiskVedlegg } from '@app/types/dokument';

interface ReadOnlyProps extends StyleProps {
  logiskeVedlegg: LogiskVedlegg[];
}

export const ReadOnlyLogiskeVedlegg = ({ logiskeVedlegg, ...styleProps }: ReadOnlyProps) => (
  <LogiskeVedleggList {...styleProps}>
    {logiskeVedlegg.length === 0 ? (
      <LogiskeVedleggListItem key="none">
        <NoAttachmentsText>Ingen logiske vedlegg</NoAttachmentsText>
      </LogiskeVedleggListItem>
    ) : (
      logiskeVedlegg.map((lv) => (
        <LogiskeVedleggListItem key={lv.logiskVedleggId}>
          <ReadOnlyLogiskVedlegg logiskVedlegg={lv} />
        </LogiskeVedleggListItem>
      ))
    )}
  </LogiskeVedleggList>
);

import { Tooltip } from '@navikt/ds-react';
import React from 'react';
import { ReadOnlyLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/read-only/logisk-vedlegg';
import {
  List,
  ListItem,
  NoAttachmentsText,
  StyleProps,
} from '@app/components/documents/document/logiske-vedlegg/shared/list-style';
import { LogiskVedlegg } from '@app/types/dokument';

interface ReadOnlyProps extends StyleProps {
  logiskeVedlegg: LogiskVedlegg[];
}

export const ReadOnlyLogiskeVedlegg = ({ logiskeVedlegg, ...styleProps }: ReadOnlyProps) => (
  <Tooltip content="Logiske vedlegg" placement="top">
    <List {...styleProps}>
      {logiskeVedlegg.length === 0 ? (
        <ListItem key="none">
          <NoAttachmentsText>Ingen logiske vedlegg</NoAttachmentsText>
        </ListItem>
      ) : (
        logiskeVedlegg.map((lv) => (
          <ListItem key={lv.logiskVedleggId}>
            <ReadOnlyLogiskVedlegg logiskVedlegg={lv} />
          </ListItem>
        ))
      )}
    </List>
  </Tooltip>
);

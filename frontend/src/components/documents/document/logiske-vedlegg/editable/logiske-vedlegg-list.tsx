import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import React, { useCallback, useState } from 'react';
import { styled } from 'styled-components';
import { CreateLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/create';
import { EditableLogiskVedlegg } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/editable';
import {
  LogiskeVedleggList,
  LogiskeVedleggListItem,
  NoAttachmentsText,
  StyleProps,
} from '@app/components/documents/document/logiske-vedlegg/shared/list-style';
import { LogiskVedlegg } from '@app/types/dokument';

interface Props extends StyleProps {
  logiskeVedlegg: LogiskVedlegg[];
  dokumentInfoId: string;
  temaId: string | null;
}

export const EditableLogiskeVedlegg = ({ logiskeVedlegg, dokumentInfoId, temaId, ...styleProps }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const stopMouseDown = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  const hasLogiskeVedlegg = logiskeVedlegg.length !== 0;

  return (
    <LogiskeVedleggList onMouseDown={stopMouseDown} {...styleProps}>
      {!hasLogiskeVedlegg && !isOpen ? (
        <LogiskeVedleggListItem key="none-create">
          <Tooltip content="Legg til logisk vedlegg">
            <CreateButton
              size="xsmall"
              variant="tertiary"
              onClick={() => setIsOpen(true)}
              icon={<PlusCircleIcon aria-hidden />}
              iconPosition="right"
            >
              <NoAttachmentsText>Ingen logiske vedlegg</NoAttachmentsText>
            </CreateButton>
          </Tooltip>
        </LogiskeVedleggListItem>
      ) : (
        logiskeVedlegg.map((lv) => (
          <LogiskeVedleggListItem key={lv.logiskVedleggId}>
            <EditableLogiskVedlegg
              dokumentInfoId={dokumentInfoId}
              logiskVedlegg={lv}
              logiskeVedlegg={logiskeVedlegg}
              temaId={temaId}
            />
          </LogiskeVedleggListItem>
        ))
      )}

      {isOpen ? (
        <LogiskeVedleggListItem key="create">
          <CreateLogiskVedlegg
            dokumentInfoId={dokumentInfoId}
            logiskeVedlegg={logiskeVedlegg}
            onClose={() => setIsOpen(false)}
            temaId={temaId}
          />
        </LogiskeVedleggListItem>
      ) : null}

      {!isOpen && hasLogiskeVedlegg ? (
        <LogiskeVedleggListItem key="toggle-create">
          <Tooltip content="Legg til logisk vedlegg">
            <Button
              size="xsmall"
              variant="tertiary"
              onClick={() => setIsOpen(true)}
              icon={<PlusCircleIcon aria-hidden />}
              onMouseDown={stopMouseDown}
            />
          </Tooltip>
        </LogiskeVedleggListItem>
      ) : null}
    </LogiskeVedleggList>
  );
};

const CreateButton = styled(Button)`
  justify-content: flex-start;
`;

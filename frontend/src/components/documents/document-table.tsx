import { ColumnHeaders } from '@app/components/documents/column-headers';
import { Dokument } from '@app/components/documents/document/document';
import { useFilteredDocuments } from '@app/components/documents/filter-helpers';
import type { DateRange } from '@app/types/common';
import type { IArkivertDocument } from '@app/types/dokument';
import { useMemo, useState } from 'react';
import { List, type RowComponentProps, useDynamicRowHeight } from 'react-window';
import type { BaseSelectDocumentProps } from './document/types';

const getExpandedRecords = (dokumenter: IArkivertDocument[], expanded: boolean) =>
  dokumenter.reduce<Record<string, boolean>>((acc, d) => {
    acc[`${d.journalpostId}-${d.dokumentInfoId}`] = (d.vedlegg.length > 0 || d.logiskeVedlegg.length > 0) && expanded;

    return acc;
  }, {});

interface Props extends BaseSelectDocumentProps {
  dokumenter: IArkivertDocument[];
}

export const DocumentTable = ({ dokumenter, selectJournalpost, getIsSelected, getCanBeSelected }: Props) => {
  const [search, setSearch] = useState<string>('');
  const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAvsenderMottakere, setSelectedAvsenderMottakere] = useState<string[]>([]);
  const [selectedSaksIds, setSelectedSaksIds] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  const [expanded, setExpanded] = useState(getExpandedRecords(dokumenter, true));
  const someExpanded = useMemo(() => Object.values(expanded).some((e) => e), [expanded]);

  const filteredDokumenter = useFilteredDocuments(
    dokumenter,
    selectedAvsenderMottakere,
    selectedDateRange,
    selectedSaksIds,
    selectedTemaer,
    selectedTypes,
    search,
  );

  const rowHeight = useDynamicRowHeight({ defaultRowHeight: 32 });

  return (
    <>
      <ColumnHeaders
        search={search}
        setSearch={setSearch}
        selectedTemaer={selectedTemaer}
        setSelectedTemaer={setSelectedTemaer}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedAvsenderMottakere={selectedAvsenderMottakere}
        setSelectedAvsenderMottakere={setSelectedAvsenderMottakere}
        selectedSaksIds={selectedSaksIds}
        setSelectedSaksIds={setSelectedSaksIds}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        documents={dokumenter}
        someExpanded={someExpanded}
        toggleExpandAll={() => setExpanded(getExpandedRecords(dokumenter, !someExpanded))}
      />
      <List
        rowComponent={RowComponent}
        rowCount={filteredDokumenter.length}
        rowHeight={rowHeight}
        rowProps={{ filteredDokumenter, getIsSelected, selectJournalpost, getCanBeSelected, expanded, setExpanded }}
      />
    </>
  );
};

interface RowProps extends BaseSelectDocumentProps {
  filteredDokumenter: IArkivertDocument[];
  expanded: Record<string, boolean>;
  setExpanded: (value: Record<string, boolean>) => void;
}

const RowComponent = ({
  index,
  getIsSelected,
  selectJournalpost,
  getCanBeSelected,
  filteredDokumenter,
  expanded,
  setExpanded,
  ariaAttributes,
  style,
}: RowComponentProps<RowProps>) => {
  const document = filteredDokumenter[index];

  if (document === undefined) {
    return null;
  }

  const id = `${document.journalpostId}-${document.dokumentInfoId}`;

  return (
    <Dokument
      key={id}
      dokument={document}
      isExpanded={expanded[id] === true}
      toggleExpanded={() => setExpanded({ ...expanded, [id]: !expanded[id] })}
      selectJournalpost={selectJournalpost}
      getIsSelected={getIsSelected}
      getCanBeSelected={getCanBeSelected}
      style={style}
      ariaAttributes={ariaAttributes}
      isOdd={index % 2 === 1}
    />
  );
};

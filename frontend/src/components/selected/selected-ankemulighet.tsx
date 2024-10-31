import { Card } from '@app/components/card/card';
import { TypeName } from '@app/components/muligheter/anke/type-name';
import { UsedCount } from '@app/components/muligheter/anke/used-count';
import { Header, StyledTable, TableWrapper, Thead } from '@app/components/selected/styled-components';
import { YtelseTag } from '@app/components/ytelse-tag/ytelse-tag';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId } from '@app/hooks/kodeverk';
import { useMulighet } from '@app/hooks/use-mulighet';
import { SaksTypeEnum } from '@app/types/common';
import type { IAnkemulighet, IOmgjøringskravmulighet } from '@app/types/mulighet';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Heading, Tag } from '@navikt/ds-react';

interface Props {
  onClick: () => void;
}

export const SelectedMulighet = ({ onClick }: Props) => {
  const { typeId, mulighet } = useMulighet();

  if ((typeId !== SaksTypeEnum.ANKE && typeId !== SaksTypeEnum.OMGJØRINGSKRAV) || mulighet === undefined) {
    return null;
  }

  return <RenderMulighet mulighet={mulighet} onClick={onClick} type={typeId} />;
};

interface RenderProps extends Props {
  mulighet: IAnkemulighet | IOmgjøringskravmulighet;
  type: SaksTypeEnum.ANKE | SaksTypeEnum.OMGJØRINGSKRAV;
}

const RenderMulighet = ({ mulighet, onClick, type }: RenderProps) => (
  <Card>
    <Header>
      <Heading size="small" level="1">
        Valgt vedtak
      </Heading>
      <Button
        size="small"
        title={`Vis alle ${type === SaksTypeEnum.ANKE ? 'anke' : 'omgjøringskrav'}muligheter`}
        onClick={onClick}
        icon={<ChevronDownIcon aria-hidden />}
        variant="tertiary-neutral"
      />
    </Header>
    <SelectedMulighetBody {...mulighet} />
  </Card>
);

export const SelectedMulighetBody = (mulighet: IAnkemulighet | IOmgjøringskravmulighet) => {
  const { ytelseId, vedtakDate, fagsakId, originalFagsystemId, typeId, temaId, sourceOfExistingAnkebehandling } =
    mulighet;

  const fagsystemName = useFagsystemName(originalFagsystemId);
  const temaName = useFullTemaNameFromId(temaId);

  return (
    <TableWrapper>
      <StyledTable>
        <Thead>
          <tr>
            <th>Type</th>
            <th>Fagsak-ID</th>
            <th>Tema</th>
            <th>Ytelse</th>
            <th>Vedtaksdato</th>
            <th>Fagsystem</th>
            <th />
          </tr>
        </Thead>
        <tbody>
          <tr>
            <td>
              <TypeName typeId={typeId} />
            </td>
            <td>{fagsakId}</td>
            <td>
              <Tag size="small" variant="alt3">
                {temaName}
              </Tag>
            </td>
            <td>
              <YtelseTag ytelseId={ytelseId} />
            </td>
            <td>
              {vedtakDate === null ? (
                'Ukjent'
              ) : (
                <time dateTime={vedtakDate}>{isoDateToPretty(vedtakDate) ?? vedtakDate}</time>
              )}
            </td>
            <td>{fagsystemName}</td>
            {sourceOfExistingAnkebehandling.length === 0 ? null : (
              <td>
                <UsedCount usedCount={sourceOfExistingAnkebehandling.length} />
              </td>
            )}
          </tr>
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

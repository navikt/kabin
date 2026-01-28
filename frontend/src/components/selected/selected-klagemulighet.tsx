import { Card } from '@app/components/card/card';
import { Header, StyledTable, TableWrapper, Thead } from '@app/components/selected/styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useFagsystemName, useFullTemaNameFromId, useVedtaksenhetName } from '@app/hooks/kodeverk';
import { useMulighet } from '@app/hooks/use-mulighet';
import { SaksTypeEnum } from '@app/types/common';
import type { IKlagemulighet } from '@app/types/mulighet';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, Tag } from '@navikt/ds-react';

interface Props {
  onClick: () => void;
}

export const SelectedKlagemulighet = ({ onClick }: Props) => {
  const { typeId, mulighet } = useMulighet();

  if (typeId !== SaksTypeEnum.KLAGE || mulighet === undefined) {
    return null;
  }

  return <RenderKlagemulighet mulighet={mulighet} onClick={onClick} />;
};

interface RenderProps extends Props {
  mulighet: IKlagemulighet;
}

const RenderKlagemulighet = ({ mulighet, onClick }: RenderProps) => (
  <Card>
    <Header>
      <Heading size="small" level="1">
        Valgt klagemulighet
      </Heading>
      <Button
        data-color="neutral"
        size="small"
        title="Vis alle klagemuligheter"
        onClick={onClick}
        icon={<ChevronDownIcon aria-hidden />}
        variant="tertiary"
      />
    </Header>

    <SelectedKlagemulighetBody {...mulighet} />
  </Card>
);

export const SelectedKlagemulighetBody = (mulighet: IKlagemulighet) => {
  const { temaId, vedtakDate, fagsakId, originalFagsystemId, klageBehandlendeEnhet } = mulighet;

  const temaName = useFullTemaNameFromId(temaId);
  const vedtaksenhetName = useVedtaksenhetName(klageBehandlendeEnhet);
  const fagsystemName = useFagsystemName(originalFagsystemId);

  return (
    <TableWrapper>
      <StyledTable>
        <Thead>
          <tr>
            <th>Fagsak-ID</th>
            <th>Tema</th>
            <th>Vedtak/innstilling</th>
            <th>Behandlende enhet</th>
            <th>Fagsystem</th>
          </tr>
        </Thead>
        <tbody>
          <tr>
            <td>{fagsakId}</td>
            <td>
              <Tag data-color="info" size="small" variant="outline">
                {temaName}
              </Tag>
            </td>
            <td>
              <Detail as="time" dateTime={vedtakDate}>
                {isoDateToPretty(vedtakDate) ?? vedtakDate}
              </Detail>
            </td>
            <td>{vedtaksenhetName}</td>
            <td>{fagsystemName}</td>
          </tr>
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

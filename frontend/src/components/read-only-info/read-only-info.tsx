import { Label, Tag, TagProps } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { useHjemmelName, useYtelseName } from '@app/hooks/kodeverk';

interface BaseProps {
  id: string;
  label: string;
}

interface TextProps extends BaseProps {
  value: string | null;
}

export const ReadOnlyTime = ({ value, ...props }: TextProps) => (
  <ReadOnly {...props}>
    {value === null ? <i>Ikke satt</i> : <time dateTime={value}>{isoDateToPretty(value)}</time>}
  </ReadOnly>
);

export const ReadOnlyText = ({ value, ...props }: TextProps) => (
  <ReadOnly {...props}>{value ?? <i>Ikke satt</i>}</ReadOnly>
);

interface HjemlerProps extends BaseProps {
  hjemmelIdList: string[] | null;
}

export const ReadOnlyHjemler = ({ hjemmelIdList }: HjemlerProps) => (
  <ReadOnly id="hjemler" label="Hjemler">
    <TagsContainer>
      {hjemmelIdList === null || hjemmelIdList.length === 0 ? (
        <i>Ingen</i>
      ) : (
        hjemmelIdList.map((h) => <HjemmelTag hjemmelId={h} key={h} />)
      )}
    </TagsContainer>
  </ReadOnly>
);

interface ReadOnlyProps extends BaseProps {
  children: React.ReactNode;
}

const ReadOnly = ({ id, label, children }: ReadOnlyProps) => (
  <StyledReadOnly>
    <Label size="small" htmlFor={id}>
      {label}
    </Label>
    <div id={id}>{children}</div>
  </StyledReadOnly>
);

const TagsContainer = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

export const HjemmelTag = ({ hjemmelId }: { hjemmelId: string }) => {
  const hjemmelName = useHjemmelName(hjemmelId);

  return (
    <Tag variant="info" size="small" title="Hentet fra kildesystem">
      {hjemmelName}
    </Tag>
  );
};

interface IYtelseTagProps extends Omit<TagProps, 'children' | 'variant'> {
  ytelseId: string;
}

export const YtelseTag = ({ ytelseId, ...props }: IYtelseTagProps) => {
  const ytelseName = useYtelseName(ytelseId);

  return ytelseName === undefined ? (
    'Ingen'
  ) : (
    <Tag variant="info" size="medium" title="Hentet fra kildesystem" {...props}>
      {ytelseName}
    </Tag>
  );
};

const StyledReadOnly = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

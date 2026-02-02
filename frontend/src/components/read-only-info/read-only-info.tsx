import { isoDateToPretty } from '@app/domain/date';
import { useHjemmelName, useYtelseName } from '@app/hooks/kodeverk';
import { HStack, Label, Tag, type TagProps, VStack } from '@navikt/ds-react';

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
    <HStack gap="space-4" wrap={false}>
      {hjemmelIdList === null || hjemmelIdList.length === 0 ? (
        <i>Ingen</i>
      ) : (
        hjemmelIdList.map((h) => <HjemmelTag hjemmelId={h} key={h} />)
      )}
    </HStack>
  </ReadOnly>
);

interface ReadOnlyProps extends BaseProps {
  children: React.ReactNode;
}

const ReadOnly = ({ id, label, children }: ReadOnlyProps) => (
  <VStack gap="space-8">
    <Label size="small" htmlFor={id}>
      {label}
    </Label>
    <div id={id}>{children}</div>
  </VStack>
);

export const HjemmelTag = ({ hjemmelId }: { hjemmelId: string }) => {
  const hjemmelName = useHjemmelName(hjemmelId);

  return (
    <Tag data-color="info" variant="outline" size="small" title="Hentet fra kildesystem">
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
    <Tag data-color="info" variant="outline" size="medium" title="Hentet fra kildesystem" {...props}>
      {ytelseName}
    </Tag>
  );
};

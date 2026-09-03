import { FieldLabel } from '@app/components/svarbrev/address/layout';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, Tag, TextField, type TextFieldProps, Tooltip } from '@navikt/ds-react';
import { useMemo } from 'react';

interface Props extends Omit<TextFieldProps, 'value' | 'onChange' | 'defaultValue' | 'size'> {
  value: string | null;
  originalValue: string | null;
  onChange: (value: string | null) => void;
  error?: boolean;
}

export const AddressField = ({
  label,
  value,
  originalValue,
  onChange,
  autoFocus,
  required = false,
  error = false,
  pattern,
  // https://nav-it.slack.com/archives/G01CTUC8LSU/p1782392686456559?thread_ts=1782386695.702119&cid=G01CTUC8LSU
  maxLength = 128,
  ...props
}: Props) => {
  const isOverridden = (value ?? '') !== (originalValue ?? '');

  const patternRegex = useMemo(() => (pattern === undefined ? undefined : new RegExp(pattern)), [pattern]);

  return (
    <TextField
      maxLength={maxLength}
      size="small"
      label={
        <FieldLabel>
          {label}
          {required ? (
            <Tag data-color="info" size="xsmall" variant="outline">
              Påkrevd
            </Tag>
          ) : null}
          {isOverridden ? (
            <Tag data-color="warning" size="xsmall" variant="outline">
              Overstyrt
            </Tag>
          ) : null}
          {isOverridden ? (
            <Tooltip content={`Tilbakestill til «${originalValue}»`}>
              <Button
                data-color="neutral"
                size="xsmall"
                variant="tertiary"
                onClick={() => onChange(originalValue)}
                icon={<ArrowUndoIcon aria-hidden />}
              />
            </Tooltip>
          ) : null}
        </FieldLabel>
      }
      value={value ?? ''}
      onChange={({ currentTarget }) => {
        onChange(
          patternRegex === undefined || patternRegex.test(currentTarget.value) ? line(currentTarget.value) : value,
        );
      }}
      autoFocus={autoFocus}
      error={error ? 'Feltet er påkrevd' : undefined}
      pattern={pattern}
      {...props}
    />
  );
};

const line = (s: string) => (s.trim().length === 0 ? null : s);

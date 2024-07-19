import { Tooltip } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { EditTag } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/styled-components';
import { Suggestions } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/suggestions-dropdown';
import { useSuggestions } from '@app/components/documents/document/logiske-vedlegg/editable/logisk-vedlegg/use-suggestions';
import { LogiskVedlegg } from '@app/types/dokument';

interface Props {
  initialValue?: string;
  logiskeVedlegg: LogiskVedlegg[];
  onDone: (value: string) => void;
  onDelete?: () => void;
  onClose: () => void;
  isLoading: boolean;
  placeholder?: string;
  temaId: string | null;
  closeOnDone?: boolean;
}

export const EditLogiskVedlegg = ({
  initialValue = '',
  logiskeVedlegg,
  onDone,
  onClose,
  onDelete,
  isLoading,
  placeholder,
  temaId,
  closeOnDone = false,
}: Props) => {
  const lowerCaseInitialValue = initialValue.toLowerCase();
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLSpanElement>(null);
  const customValueRef = useRef(initialValue);
  const [customValue, setCustomValue] = useState(initialValue);
  const { suggestions, lastIndex } = useSuggestions({ logiskeVedlegg, customValue, temaId });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const setCaretAtEnd = useCallback(() => {
    if (ref.current !== null && ref.current.isContentEditable) {
      const selection = window.getSelection();

      if (selection !== null) {
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  useEffect(setCaretAtEnd, [setCaretAtEnd]);

  const setContent = useCallback((content: string) => {
    if (ref.current !== null) {
      ref.current.textContent = content;
    }
  }, []);

  const onSelect = useCallback(
    (tittel: string) => {
      customValueRef.current = '';
      setCustomValue('');
      setActiveIndex(-1);

      const lowerCaseTittel = tittel.toLowerCase();

      if (
        lowerCaseTittel !== lowerCaseInitialValue &&
        !logiskeVedlegg.some((la) => la.tittel.toLowerCase() === lowerCaseTittel)
      ) {
        onDone(tittel);
      }

      if (closeOnDone) {
        onClose();
      } else {
        setContent('');
      }
    },
    [closeOnDone, logiskeVedlegg, lowerCaseInitialValue, onClose, onDone, setContent],
  );

  const onSelectCustom = useCallback(
    (e: React.FormEvent<HTMLSpanElement>) => {
      const tittel = getText(e);

      if (tittel === undefined) {
        return onClose();
      }

      if (tittel.length === 0) {
        onDelete?.();

        return onClose();
      }

      return onSelect(tittel);
    },
    [onDelete, onClose, onSelect],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter' || (!e.shiftKey && e.key === 'Tab')) {
        e.preventDefault();

        if (activeIndex !== -1) {
          const selected = suggestions[activeIndex];

          if (selected !== undefined) {
            return onSelect(selected);
          }
        }

        return onSelectCustom(e);
      }

      if (e.shiftKey && e.key === 'Tab') {
        return onClose();
      }

      if (e.key === 'Escape') {
        e.preventDefault();

        return onClose();
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();

        return setActiveIndex((i) => (i + 1) % suggestions.length);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();

        return setActiveIndex((i) => (i === -1 ? lastIndex : i - 1));
      }
    },
    [activeIndex, onSelectCustom, suggestions, onSelect, onClose, lastIndex],
  );

  useEffect(() => {
    setContent(activeIndex === -1 ? customValueRef.current : suggestions[activeIndex] ?? customValueRef.current);
    setCaretAtEnd();
  }, [suggestions, activeIndex, setCaretAtEnd, setContent]);

  useEffect(() => {
    if (activeIndex > lastIndex) {
      setActiveIndex(-1);
    }
  }, [activeIndex, lastIndex]);

  useEffect(() => {
    if (activeIndex !== -1 || customValue.length !== 0) {
      setShowSuggestions(true);
    }
  }, [activeIndex, customValue]);

  return (
    <Container onMouseDown={(e) => e.stopPropagation()}>
      <Tooltip content={`${placeholder} logisk vedlegg`} keys={['Enter', 'Tab', 'Esc']} open>
        <EditTag
          key="edit-tag"
          ref={ref}
          size="small"
          variant="neutral"
          role="textbox"
          aria-multiline="false"
          aria-placeholder={placeholder}
          contentEditable={!isLoading}
          suppressContentEditableWarning
          tabIndex={0}
          autoFocus
          onKeyDown={onKeyDown}
          onClick={() => setShowSuggestions(true)}
          onBlur={onSelectCustom}
          onInput={(e) => {
            setActiveIndex(-1);
            customValueRef.current = getText(e) ?? '';
            setCustomValue(customValueRef.current);
          }}
        >
          {initialValue}
        </EditTag>
      </Tooltip>
      {showSuggestions ? <Suggestions suggestions={suggestions} activeIndex={activeIndex} onSelect={onSelect} /> : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const getText = (e: React.FormEvent<HTMLSpanElement>) => e.currentTarget.textContent?.replaceAll('\n', ' ').trim();

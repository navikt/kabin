import { RefObject, useEffect } from 'react';

type Callback = (event: MouseEvent | TouchEvent | KeyboardEvent) => void;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: Callback,
  ref: RefObject<T>,
  children = false,
) =>
  useEffect(() => {
    const mouseListener = (e: MouseEvent | TouchEvent) => {
      if (ref.current === null) {
        return;
      }

      if (e.target instanceof window.Node) {
        const { target } = e;

        if (children && Array.from(ref.current.children).every((c) => !c.contains(target))) {
          callback(e);
        } else if (!ref.current.contains(target)) {
          callback(e);
        }
      }
    };

    const escapeListener = (e: KeyboardEvent) => {
      if (ref.current === null) {
        return;
      }

      if (e.key === 'Escape') {
        callback(e);
      }
    };

    window.addEventListener('mousedown', mouseListener);
    document.addEventListener(`touchstart`, mouseListener);
    window.addEventListener('keydown', escapeListener);

    return () => {
      window.removeEventListener('mousedown', mouseListener);
      document.removeEventListener(`touchstart`, mouseListener);
      window.removeEventListener('keydown', escapeListener);
    };
  }, [callback, ref, children]);

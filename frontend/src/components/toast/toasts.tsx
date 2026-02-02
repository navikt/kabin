import { type Message, toast } from '@app/components/toast/store';
import { Toast } from '@app/components/toast/toast';
import { VStack } from '@navikt/ds-react';
import { useEffect, useRef, useState } from 'react';

export const Toasts = () => {
  const [toasts, setToasts] = useState<Message[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const previousLength = useRef(0);

  useEffect(() => {
    toast.subscribe(setToasts);

    return () => toast.unsubscribe(setToasts);
  }, []);

  useEffect(() => {
    if (toasts.length > previousLength.current) {
      const { current } = ref;

      if (current !== null) {
        current.scrollTop = current.scrollHeight;
      }
    }
    previousLength.current = toasts.length;
  }, [toasts.length]);

  const toastList = toasts.map((props) => <Toast key={props.id} {...props} />);

  return (
    <VStack
      ref={ref}
      aria-live="polite"
      aria-relevant="additions text"
      gap="space-8"
      overflowY="auto"
      overflowX="visible"
      marginBlock="space-8 space-0"
      className="fixed right-0 bottom-2 z-[1000] max-h-[calc(100%-16px)] pr-2"
    >
      {toastList}
    </VStack>
  );
};

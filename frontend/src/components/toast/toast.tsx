import {
  CheckmarkCircleFillIconColored,
  ExclamationmarkTriangleFillIconColored,
  InformationSquareFillIconColored,
  XMarkOctagonFillIconColored,
} from '@app/components/colored-icons/colored-icons';
import { SLIDE_DURATION, TOAST_TIMEOUT } from '@app/components/toast/constants';
import { BaseToastStyle, Container, Content, StyledCloseButton, TimedToastStyle } from '@app/components/toast/layout';
import type { Message } from '@app/components/toast/store';
import { ToastType } from '@app/components/toast/types';
import { XMarkIcon } from '@navikt/aksel-icons';
import { memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

export const CLOSE_TOAST_EVENT_TYPE = 'close-toast';

export const Toast = memo(
  ({ type, expiresAt, close, message, id, ...rest }: Message) => {
    const ref = useRef<HTMLDivElement>(null);

    const slideOut = useCallback(() => {
      if (ref.current === null) {
        return close();
      }

      const anim = ref.current.animate(SLIDE_OUT_KEYFRAMES, SLIDE_OUT_OPTIONS);

      anim.addEventListener('finish', close);
    }, [close]);

    useEffect(() => {
      const element = ref.current;

      if (element === null) {
        return;
      }

      element.addEventListener(CLOSE_TOAST_EVENT_TYPE, slideOut);

      return () => element.removeEventListener(CLOSE_TOAST_EVENT_TYPE, slideOut);
    }, [slideOut]);

    if (expiresAt !== Number.POSITIVE_INFINITY) {
      return (
        <TimedToast
          type={type}
          expiresAt={expiresAt}
          close={close}
          message={message}
          id={id}
          key={id}
          ref={ref}
          {...rest}
        />
      );
    }

    return (
      <BaseToastStyle type={type} ref={ref} key={id}>
        <StyledCloseButton
          variant="tertiary-neutral"
          size="xsmall"
          onClick={slideOut}
          icon={<XMarkIcon aria-hidden />}
        />
        <Container>
          <Icon type={type} />
          <Content>{message}</Content>
        </Container>
      </BaseToastStyle>
    );
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id && prevProps.expiresAt === nextProps.expiresAt,
);

Toast.displayName = 'Toast';

interface TimedToastProps extends Message {
  ref: React.Ref<HTMLDivElement>;
}

const TimedToast = ({ type, message, close, setExpiresAt, expiresAt, id, ref }: TimedToastProps) => {
  const innerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => innerRef.current);

  const [remaining, setRemaining] = useState<number | null>(null);
  const mouse = useRef<MouseEvent | null>(null);

  const onMouseLeave = useCallback(() => {
    setExpiresAt(
      Date.now() + (remaining === null || remaining === Number.POSITIVE_INFINITY ? TOAST_TIMEOUT : remaining),
    );
    setRemaining(null);
  }, [remaining, setExpiresAt]);

  const onMouseEnter = useCallback(() => {
    setRemaining(expiresAt - Date.now());
    setExpiresAt(Number.POSITIVE_INFINITY);
  }, [expiresAt, setExpiresAt]);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      mouse.current = e;
    };

    window.addEventListener('mousemove', listener);

    return () => window.removeEventListener('mousemove', listener);
  }, []);

  useEffect(() => {
    if (mouse.current === null) {
      return;
    }

    const { target } = mouse.current;

    if (
      expiresAt === Number.POSITIVE_INFINITY &&
      innerRef.current !== null &&
      target instanceof window.Node &&
      innerRef.current !== target &&
      !innerRef.current.contains(target)
    ) {
      onMouseLeave();
    }
  }, [expiresAt, onMouseLeave]);

  const slideOut = useCallback(() => {
    if (innerRef.current === null) {
      return close();
    }

    const anim = innerRef.current.animate(SLIDE_OUT_KEYFRAMES, SLIDE_OUT_OPTIONS);

    anim.addEventListener('finish', close);
  }, [close]);

  useEffect(() => {
    if (expiresAt === Number.POSITIVE_INFINITY) {
      return;
    }

    const timeout = expiresAt - Date.now() - SLIDE_DURATION;
    const timer = setTimeout(slideOut, timeout);

    return () => clearTimeout(timer);
  }, [expiresAt, slideOut]);

  const paused = remaining !== null;

  return (
    <TimedToastStyle
      type={type}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      paused={paused}
      timeout={expiresAt - Date.now()}
      ref={innerRef}
      key={id}
    >
      <StyledCloseButton variant="tertiary-neutral" size="xsmall" onClick={slideOut} icon={<XMarkIcon aria-hidden />} />
      <Container>
        <Icon type={type} />
        <Content>{message}</Content>
      </Container>
    </TimedToastStyle>
  );
};

const SLIDE_OUT_KEYFRAMES: Keyframe[] = [
  { transform: 'translateX(0%)' },
  { transform: 'translateX(calc(100% + 8px))' },
];

const SLIDE_OUT_OPTIONS: KeyframeAnimationOptions = {
  duration: SLIDE_DURATION,
  easing: 'ease-in-out',
  fill: 'forwards',
};

interface IconProps {
  type: ToastType;
}

const Icon = ({ type }: IconProps) => {
  switch (type) {
    case ToastType.SUCCESS:
      return <CheckmarkCircleFillIconColored aria-hidden />;
    case ToastType.ERROR:
      return <XMarkOctagonFillIconColored aria-hidden />;
    case ToastType.INFO:
      return <InformationSquareFillIconColored aria-hidden />;
    case ToastType.WARNING:
      return <ExclamationmarkTriangleFillIconColored aria-hidden />;
  }
};

const CMD = '⌘';
const CTRL = 'Ctrl';
const IS_MAC = navigator.platform.startsWith('Mac');
export const MOD_KEY_TEXT = IS_MAC ? CMD : CTRL;

interface KeyEvent {
  metaKey: boolean;
  ctrlKey: boolean;
}

export const isMetaKey: (event: KeyEvent) => boolean = IS_MAC ? (event) => event.metaKey : (event) => event.ctrlKey;

export enum Keys {
  Enter = 'Enter',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Home = 'Home',
  End = 'End',
  Escape = 'Escape',
}

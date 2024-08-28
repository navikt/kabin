import '@navikt/ds-css';
import { App } from '@app/components/app/app';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}

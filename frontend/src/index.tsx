import '@navikt/ds-css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeObservability } from '@app/observability';
import { App } from './components/app/app';

initializeObservability();

const container = document.getElementById('app');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}

if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}

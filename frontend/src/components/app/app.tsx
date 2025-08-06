import { Router } from '@app/components/app/router';
import { StaticDataLoader } from '@app/components/app/static-data-context';
import { reduxStore } from '@app/redux/configure-store';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

export const App = () => (
  <StrictMode>
    <BrowserRouter>
      <StaticDataLoader>
        <Provider store={reduxStore}>
          <Router />
        </Provider>
      </StaticDataLoader>
    </BrowserRouter>
  </StrictMode>
);

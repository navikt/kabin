import React, { Suspense } from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import { RouterLoader } from './loader';

export const Router = () => (
  <Suspense fallback={<RouterLoader />}>
    <Switch>
      <Route
        path="/"
        element={
          <h1
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
          >
            Velkommen til Kabin!
          </h1>
        }
      />
    </Switch>
  </Suspense>
);

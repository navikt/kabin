import React, { Suspense } from 'react';
import { Navigate, Route, Routes as Switch } from 'react-router-dom';
import { CreatePage } from '../../pages/create/create';
import { StatusPage } from '../../pages/status/status';
import { SaksTypeEnum } from '../../types/common';
import { RouterLoader } from './loader';

export const Router = () => (
  <Suspense fallback={<RouterLoader />}>
    <Switch>
      <Route index element={<Navigate to="/anker" replace />} />
      <Route path="/anker">
        <Route path="" element={<CreatePage />} />
        <Route path=":id/status" element={<StatusPage type={SaksTypeEnum.ANKE} />} />
      </Route>
      <Route path="/klager">
        <Route path="" element={<CreatePage />} />
        <Route path=":id/status" element={<StatusPage type={SaksTypeEnum.KLAGE} />} />
      </Route>
    </Switch>
  </Suspense>
);

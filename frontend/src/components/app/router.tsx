import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminPage } from '@app/pages/admin';
import { CreatePage } from '@app/pages/create/create';
import { AnkeStatusPage } from '@app/pages/status/anke-status';
import { KlageStatusPage } from '@app/pages/status/klage-status';
import { SaksTypeEnum } from '@app/types/common';
import { RedirectUser } from './redirect-user';
import { RouterLoader } from './router-loader';

export const Router = () => (
  <Suspense fallback={<RouterLoader />}>
    <Routes>
      <Route index element={<RedirectUser />} />
      <Route path="/opprett" element={<CreatePage />} />
      <Route path="/anke/:id/status" element={<AnkeStatusPage type={SaksTypeEnum.ANKE} />} />
      <Route path="/klage/:id/status" element={<KlageStatusPage type={SaksTypeEnum.KLAGE} />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </Suspense>
);

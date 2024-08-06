import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@app/components/app/protected-route';
import { AdminPage } from '@app/pages/admin';
import { CreatePage } from '@app/pages/create/create';
import { IndexPage } from '@app/pages/index';
import { AnkeStatusPage } from '@app/pages/status/anke-status';
import { KlageStatusPage } from '@app/pages/status/klage-status';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/common';
import { RouterLoader } from './router-loader';

export const Router = () => (
  <Suspense fallback={<RouterLoader />}>
    <Routes>
      <Route element={<ProtectedRoute roles={[Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]} />}>
        <Route index element={<IndexPage />} />
        <Route path="/registrering/:id" element={<CreatePage />} />
        <Route path="/anke/:id/status" element={<AnkeStatusPage type={SaksTypeEnum.ANKE} />} />
        <Route path="/klage/:id/status" element={<KlageStatusPage type={SaksTypeEnum.KLAGE} />} />
      </Route>

      <Route element={<ProtectedRoute roles={[Role.KABAL_ADMIN]} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Suspense>
);

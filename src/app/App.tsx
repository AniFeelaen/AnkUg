import { AppealsListPage } from '@/pages/appeals-list/ui/AppealsListPage';
import { AppealDetailPage } from '@/pages/appeal-detail/ui/AppealDetailPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';

export function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<AppealsListPage />} />
        <Route path="appeals/:id" element={<AppealDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

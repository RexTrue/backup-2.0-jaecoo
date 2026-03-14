import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/login-page';
import AdminDashboardPage from './modules/dashboard/pages/admin-dashboard-page';
import LandingPage from './modules/landing/pages/landing-page';
import ServiceManagerDashboardPage from './modules/service/pages/service-manager-dashboard-page';
import MechanicDashboardPage from './modules/mechanic/pages/mechanic-dashboard-page';
import FrontDeskDashboardPage from './modules/front-desk/pages/front-desk-dashboard-page';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
      <Route path="/dashboard/admin/:section" element={<AdminDashboardPage />} />
      <Route path="/dashboard/service-manager" element={<ServiceManagerDashboardPage />} />
      <Route path="/dashboard/service-manager/:section" element={<ServiceManagerDashboardPage />} />
      <Route path="/dashboard/mechanic" element={<MechanicDashboardPage />} />
      <Route path="/dashboard/mechanic/:section" element={<MechanicDashboardPage />} />
      <Route path="/dashboard/front-desk" element={<FrontDeskDashboardPage />} />
      <Route path="/dashboard/front-desk/:section" element={<FrontDeskDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

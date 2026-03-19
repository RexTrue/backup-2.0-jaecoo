import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppErrorPage } from '@/common/components/feedback/app-error-page';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { AuthLayout } from '@/common/layout/auth-layout';
import { DashboardLayout } from '@/common/layout/dashboard-layout';
import { ProtectedRoute } from '@/app/router/protected-route';

const LandingPage = lazy(() => import('@/modules/landing/pages/landing-page'));
const LoginPage = lazy(() => import('@/modules/auth/pages/login-page').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/modules/dashboard/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })));
const WorkOrderListPage = lazy(() => import('@/modules/work-orders/pages/work-order-list-page').then((m) => ({ default: m.WorkOrderListPage })));
const WorkOrderCreatePage = lazy(() => import('@/modules/work-orders/pages/work-order-create-page').then((m) => ({ default: m.WorkOrderCreatePage })));
const ServiceBoardPage = lazy(() => import('@/modules/services/pages/service-board-page').then((m) => ({ default: m.ServiceBoardPage })));
const ServiceStatusPage = lazy(() => import('@/modules/services/pages/service-status-page').then((m) => ({ default: m.ServiceStatusPage })));
const ServiceDetailPage = lazy(() => import('@/modules/services/pages/service-detail-page').then((m) => ({ default: m.ServiceDetailPage })));
const UserManagementPage = lazy(() => import('@/modules/users/pages/user-management-page').then((m) => ({ default: m.UserManagementPage })));
const UserCreatePage = lazy(() => import('@/modules/users/pages/user-create-page').then((m) => ({ default: m.UserCreatePage })));
const ReportPage = lazy(() => import('@/modules/reports/pages/report-page').then((m) => ({ default: m.ReportPage })));

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<LoadingState message="Memuat halaman..." rows={2} />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  { path: '/', element: withSuspense(<LandingPage />), errorElement: <AppErrorPage /> },
  {
    path: '/login',
    element: <AuthLayout />,
    errorElement: <AppErrorPage />,
    children: [{ index: true, element: withSuspense(<LoginPage />) }],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <AppErrorPage />,
    children: [
      { path: 'app', element: <Navigate to="/dashboard" replace /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: withSuspense(<DashboardPage />) },
          { path: 'work-orders', element: withSuspense(<WorkOrderListPage />) },
          { path: 'work-orders/new', element: withSuspense(<WorkOrderCreatePage />) },
          { path: 'services', element: withSuspense(<ServiceBoardPage />) },
          { path: 'services/status/:status', element: withSuspense(<ServiceStatusPage />) },
          { path: 'services/:serviceId', element: withSuspense(<ServiceDetailPage />) },
          { path: 'users', element: withSuspense(<UserManagementPage />) },
          { path: 'users/new', element: withSuspense(<UserCreatePage />) },
          { path: 'reports', element: withSuspense(<ReportPage />) },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

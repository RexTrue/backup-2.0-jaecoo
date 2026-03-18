import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthLayout } from '@/common/layout/auth-layout';
import { DashboardLayout } from '@/common/layout/dashboard-layout';
import { MechanicLayout } from '@/common/layout/mechanic-layout';
import { ProtectedRoute } from '@/app/router/protected-route';
import LandingPage from '@/modules/landing/pages/landing-page';
import { LoginPage } from '@/modules/auth/pages/login-page';
import { DashboardPage } from '@/modules/dashboard/pages/dashboard-page';
import { CustomerListPage } from '@/modules/customers/pages/customer-list-page';
import { VehicleListPage } from '@/modules/vehicles/pages/vehicle-list-page';
import { WorkOrderListPage } from '@/modules/work-orders/pages/work-order-list-page';
import { WorkOrderCreatePage } from '@/modules/work-orders/pages/work-order-create-page';
import { ServiceBoardPage } from '@/modules/services/pages/service-board-page';
import { ServiceDetailPage } from '@/modules/services/pages/service-detail-page';
import { MechanicTaskPage } from '@/modules/mechanic/pages/mechanic-task-page';
import { SchedulePage } from '@/modules/schedules/pages/schedule-page';
import { UserManagementPage } from '@/modules/users/pages/user-management-page';
import { ReportPage } from '@/modules/reports/pages/report-page';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: 'app', element: <Navigate to="/dashboard" replace /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'customers', element: <CustomerListPage /> },
          { path: 'vehicles', element: <VehicleListPage /> },
          { path: 'work-orders', element: <WorkOrderListPage /> },
          { path: 'work-orders/new', element: <WorkOrderCreatePage /> },
          { path: 'services', element: <ServiceBoardPage /> },
          { path: 'services/:serviceId', element: <ServiceDetailPage /> },
          { path: 'schedules', element: <SchedulePage /> },
          { path: 'users', element: <UserManagementPage /> },
          { path: 'reports', element: <ReportPage /> },
        ],
      },
      {
        path: 'mechanic',
        element: <MechanicLayout />,
        children: [{ path: 'tasks', element: <MechanicTaskPage /> }],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
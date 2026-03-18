import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { getDefaultRouteByRole, hasPermission } from '@/common/lib/authz';

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (location.pathname.startsWith('/mechanic') && !hasPermission(user.role, 'mechanic:view-own')) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
  }

  if (location.pathname === '/users' && !hasPermission(user.role, 'users:view')) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
  }

  if (location.pathname === '/reports' && !hasPermission(user.role, 'reports:view')) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
  }

  if (location.pathname === '/schedules' && !hasPermission(user.role, 'schedules:view')) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
  }

  return <Outlet />;
}
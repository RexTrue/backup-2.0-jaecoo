import { PropsWithChildren } from 'react';
import { Permission, hasPermission } from '@/common/lib/authz';
import { useAuthStore } from '@/modules/auth/store/auth-store';

type PermissionGateProps = PropsWithChildren<{
  permission: Permission;
  fallback?: React.ReactNode;
}>;

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const role = useAuthStore((state) => state.user?.role);
  if (!hasPermission(role, permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

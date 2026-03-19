import { Role } from '@/common/types/domain';

export type Permission =
  | 'dashboard:view'
  | 'customers:view'
  | 'vehicles:view'
  | 'work-orders:view'
  | 'work-orders:create'
  | 'services:view'
  | 'services:update'
  | 'services:assign'
  | 'schedules:view'
  | 'schedules:update'
  | 'users:view'
  | 'users:update'
  | 'reports:view'
  | 'mechanic:view-own';

const ALL_ADMIN_PERMISSIONS: Permission[] = [
  'dashboard:view',
  'customers:view',
  'vehicles:view',
  'work-orders:view',
  'work-orders:create',
  'services:view',
  'services:update',
  'services:assign',
  'schedules:view',
  'schedules:update',
  'users:view',
  'users:update',
  'reports:view',
];

export const roleLabels: Record<Role, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manajer',
  FRONTLINE: 'Frontdesk',
  MEKANIK: 'Mekanik',
};

export const roleDescriptions: Record<Role, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manajer',
  FRONTLINE: 'Frontdesk',
  MEKANIK: 'Mekanik',
};

export const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: ALL_ADMIN_PERMISSIONS,
  MANAGER: ALL_ADMIN_PERMISSIONS,
  FRONTLINE: [
    'dashboard:view',
    'customers:view',
    'vehicles:view',
    'work-orders:view',
    'work-orders:create',
    'services:view',
  ],
  MEKANIK: ['dashboard:view', 'work-orders:view', 'services:view', 'services:update', 'mechanic:view-own'],
};

const routePermissionMatchers: Array<{ pattern: RegExp; permission: Permission }> = [
  { pattern: /^\/mechanic(\/|$)/, permission: 'mechanic:view-own' },
  { pattern: /^\/users(\/|$)/, permission: 'users:view' },
  { pattern: /^\/reports(\/|$)/, permission: 'reports:view' },
  { pattern: /^\/work-orders\/new(\/|$)/, permission: 'work-orders:create' },
  { pattern: /^\/work-orders(\/|$)/, permission: 'work-orders:view' },
  { pattern: /^\/services(\/|$)/, permission: 'services:view' },
  { pattern: /^\/dashboard(\/|$)/, permission: 'dashboard:view' },
];

export function hasPermission(role: Role | null | undefined, permission: Permission) {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
}

export function getRequiredPermissionForPath(pathname: string) {
  return routePermissionMatchers.find((item) => item.pattern.test(pathname))?.permission ?? null;
}

export function canAccessPath(role: Role | null | undefined, pathname: string) {
  const requiredPermission = getRequiredPermissionForPath(pathname);
  if (!requiredPermission) return true;
  return hasPermission(role, requiredPermission);
}

export function getDefaultRouteByRole(role: Role | null | undefined) {
  return '/dashboard';
}

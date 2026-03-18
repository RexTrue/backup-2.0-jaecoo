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
  MEKANIK: ['dashboard:view', 'services:view', 'services:update', 'mechanic:view-own'],
};

export function hasPermission(role: Role | null | undefined, permission: Permission) {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
}

export function getDefaultRouteByRole(role: Role | null | undefined) {
  if (role === 'MEKANIK') return '/mechanic/tasks';
  return '/dashboard';
}

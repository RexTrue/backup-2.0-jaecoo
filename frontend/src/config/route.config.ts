import { Permission } from '@/common/lib/authz';

export type AppNavItem = {
  path: string;
  label: string;
  permission: Permission;
  description: string;
};

export const appRoutes: AppNavItem[] = [
  { path: '/dashboard', label: 'Dashboard', permission: 'dashboard:view', description: '' },
  { path: '/work-orders', label: 'Work Order', permission: 'work-orders:view', description: '' },
  { path: '/services', label: 'Servis', permission: 'services:view', description: '' },
  { path: '/users', label: 'Pegawai', permission: 'users:view', description: '' },
  { path: '/reports', label: 'Laporan', permission: 'reports:view', description: '' },
];

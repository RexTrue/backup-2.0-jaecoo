import { Permission } from '@/common/lib/authz';

export type AppNavItem = {
  path: string;
  label: string;
  permission: Permission;
  description: string;
};

export const appRoutes: { main: AppNavItem[]; mechanic: AppNavItem[] } = {
  main: [
    { path: '/dashboard', label: 'Dashboard', permission: 'dashboard:view', description: '' },
    { path: '/customers', label: 'Pelanggan', permission: 'customers:view', description: '' },
    { path: '/vehicles', label: 'Kendaraan', permission: 'vehicles:view', description: '' },
    { path: '/work-orders', label: 'Work Order', permission: 'work-orders:view', description: '' },
    { path: '/services', label: 'Servis', permission: 'services:view', description: '' },
    { path: '/schedules', label: 'Jadwal', permission: 'schedules:view', description: '' },
    { path: '/users', label: 'Pegawai', permission: 'users:view', description: '' },
    { path: '/reports', label: 'Laporan', permission: 'reports:view', description: '' },
  ],
  mechanic: [
    { path: '/mechanic/tasks', label: 'Tugas Saya', permission: 'mechanic:view-own', description: '' },
    { path: '/services', label: 'Board Servis', permission: 'services:view', description: '' },
  ],
};

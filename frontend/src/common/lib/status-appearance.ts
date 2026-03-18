import { ServiceStatus } from '@/common/types/domain';

export const serviceStatusLabelMap: Record<ServiceStatus, string> = {
  ANTRIAN: 'ANTRIAN',
  DIKERJAKAN: 'PROSES SERVIS',
  TEST_DRIVE: 'SIAP TEST DRIVE',
  SELESAI: 'SELESAI',
  DIAMBIL: 'DIAMBIL',
  TERKENDALA: 'TERKENDALA',
};

export const serviceStatusBadgeMap: Record<ServiceStatus, string> = {
  ANTRIAN: 'status-badge status-badge--antrian',
  DIKERJAKAN: 'status-badge status-badge--dikerjakan',
  TEST_DRIVE: 'status-badge status-badge--test-drive',
  SELESAI: 'status-badge status-badge--selesai',
  DIAMBIL: 'status-badge status-badge--diambil',
  TERKENDALA: 'status-badge status-badge--terkendala',
};

export const serviceStatusPanelMap: Record<ServiceStatus, string> = {
  ANTRIAN: 'status-panel status-panel--antrian',
  DIKERJAKAN: 'status-panel status-panel--dikerjakan',
  TEST_DRIVE: 'status-panel status-panel--test-drive',
  SELESAI: 'status-panel status-panel--selesai',
  DIAMBIL: 'status-panel status-panel--diambil',
  TERKENDALA: 'status-panel status-panel--terkendala',
};

export const serviceStatusGlowMap: Record<ServiceStatus, string> = {
  ANTRIAN: 'shadow-[0_10px_24px_rgba(148,163,184,0.08)]',
  DIKERJAKAN: 'shadow-[0_10px_24px_rgba(56,189,248,0.09)]',
  TEST_DRIVE: 'shadow-[0_10px_24px_rgba(167,139,250,0.09)]',
  SELESAI: 'shadow-[0_10px_24px_rgba(52,211,153,0.09)]',
  DIAMBIL: 'shadow-[0_10px_24px_rgba(45,212,191,0.09)]',
  TERKENDALA: 'shadow-[0_10px_24px_rgba(251,113,133,0.09)]',
};

import { PriorityLevel, ServiceStatus } from '@/common/types/domain';

export const mechanicTasksMock: Array<{
  id: string;
  vehicle: string;
  customer: string;
  issue: string;
  status: ServiceStatus;
  priority: PriorityLevel;
}> = [
  { id: 'WO-240612', vehicle: 'JAECOO J7', customer: 'Budi Santoso', issue: 'Idle kasar dan perlu cek mounting', status: 'DIKERJAKAN', priority: 'HIGH' },
  { id: 'WO-240603', vehicle: 'JAECOO J7', customer: 'Sari Wulandari', issue: 'Test drive final setelah servis berkala', status: 'TEST_DRIVE', priority: 'NORMAL' },
  { id: 'WO-240609', vehicle: 'JAECOO J8', customer: 'Andra Pratama', issue: 'Menunggu approval penggantian sparepart', status: 'TERKENDALA', priority: 'URGENT' },
];

export const mechanicStatusSummaryMock: { status: ServiceStatus; value: string }[] = [
  { status: 'DIKERJAKAN', value: '3 unit' },
  { status: 'TEST_DRIVE', value: '1 unit' },
  { status: 'TERKENDALA', value: '1 unit' },
  { status: 'SELESAI', value: '2 unit' },
];

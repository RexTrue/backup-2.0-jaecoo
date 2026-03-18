import type { PriorityLevel, ServiceStatus, WorkOrderStatus } from '@/common/types/domain';

export type CreateWorkOrderPayload = {
  no_rangka: string;
  waktuMasuk?: string;
  status?: WorkOrderStatus;
  servis: {
    keluhan: string;
    estimasiSelesai?: string | null;
    status?: ServiceStatus;
    prioritas?: PriorityLevel;
  };
};

export interface WorkOrderListRow {
  code: string;
  unit: string;
  owner: string;
  status: WorkOrderStatus;
}

export interface WorkOrderSummaryCard {
  label: string;
  value: string;
  note: string;
}

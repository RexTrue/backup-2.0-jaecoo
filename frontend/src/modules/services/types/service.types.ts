import type { PriorityLevel, ServiceStatus } from '@/common/types/domain';

export interface UpdateServiceStatusPayload {
  status: ServiceStatus;
  note?: string;
}

export interface ServiceFilter {
  status?: ServiceStatus;
  priority?: PriorityLevel;
  keyword?: string;
  mechanicId?: number;
}

export interface CreateServicePayload {
  id_wo: number;
  keluhan: string;
  estimasiSelesai?: string | null;
  status?: ServiceStatus;
  prioritas?: PriorityLevel;
}

export interface CreateMechanicNotePayload {
  catatan: string;
}

import type {
  BackendPriorityLevel as PriorityLevel,
  BackendRole as Role,
  BackendServiceStatus as ServiceStatus,
  BackendWorkOrderStatus as WorkOrderStatus,
} from '@/common/types/backend-enums';

export type { PriorityLevel, Role, ServiceStatus, WorkOrderStatus };

export interface User {
  id_user: number;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface Customer {
  nik: string;
  nama: string;
  no_hp?: string | null;
  alamat?: string | null;
  createdAt: string;
}

export interface Vehicle {
  no_rangka: string;
  plat_nomor: string;
  jenis_mobil?: string | null;
  warna?: string | null;
  tahun?: number | null;
  kilometer: number;
  nik_pemilik: string;
  createdAt: string;
}

export interface WorkOrder {
  id_wo: number;
  waktuMasuk: string;
  status: WorkOrderStatus;
  no_rangka: string;
}

export interface MechanicNote {
  id_catatan: number;
  id_servis: number;
  catatan: string;
  waktu: string;
}

export interface ServiceHistory {
  id_riwayat: number;
  id_servis: number;
  status: ServiceStatus;
  waktu: string;
}

export interface ServiceItem {
  id_detail: number;
  id_servis: number;
  id_jenis_servis: number;
  keterangan?: string | null;
}

export interface Service {
  id_servis: number;
  id_wo: number;
  keluhan: string;
  estimasiSelesai?: string | null;
  tanggalSelesai?: string | null;
  status: ServiceStatus;
  prioritas: PriorityLevel;
  createdAt: string;
  detail_servis?: ServiceItem[];
  catatan?: MechanicNote[];
  riwayat?: ServiceHistory[];
}

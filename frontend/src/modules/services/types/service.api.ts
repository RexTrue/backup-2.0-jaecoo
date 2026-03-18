export interface BackendServiceItem {
  id_detail?: number;
  id_servis?: number;
  id_jenis_servis?: number;
  keterangan?: string | null;
}

export interface BackendMechanicNote {
  id_catatan?: number;
  id_servis?: number;
  catatan?: string;
  waktu?: string;
}

export interface BackendServiceHistory {
  id_riwayat?: number;
  id_servis?: number;
  status?: string;
  waktu?: string;
}

export interface BackendService {
  id_servis?: number;
  id_wo?: number;
  keluhan?: string;
  estimasiSelesai?: string | null;
  tanggalSelesai?: string | null;
  status?: string;
  prioritas?: string;
  createdAt?: string;
  detail_servis?: BackendServiceItem[];
  catatan?: BackendMechanicNote[];
  riwayat?: BackendServiceHistory[];
}

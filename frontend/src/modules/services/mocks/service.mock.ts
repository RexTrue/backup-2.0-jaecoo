import type { Service } from '@/common/types/domain';

export const serviceBoardMock: Service[] = [
  { id_servis: 1, id_wo: 101, keluhan: 'Ganti oli, cek rem depan, dan validasi kilometer.', status: 'ANTRIAN', prioritas: 'NORMAL', createdAt: new Date().toISOString() },
  { id_servis: 2, id_wo: 102, keluhan: 'Mesin bergetar saat idle. Butuh inspeksi mounting dan throttle body.', status: 'DIKERJAKAN', prioritas: 'URGENT', createdAt: new Date().toISOString() },
  { id_servis: 3, id_wo: 103, keluhan: 'Test drive akhir setelah service berkala dan balancing.', status: 'TEST_DRIVE', prioritas: 'HIGH', createdAt: new Date().toISOString() },
  { id_servis: 4, id_wo: 104, keluhan: 'Final QC dan penjadwalan penyerahan kendaraan.', status: 'SELESAI', prioritas: 'NORMAL', createdAt: new Date().toISOString() },
  { id_servis: 5, id_wo: 105, keluhan: 'Menunggu sparepart rem belakang.', status: 'TERKENDALA', prioritas: 'HIGH', createdAt: new Date().toISOString() },
  { id_servis: 6, id_wo: 106, keluhan: 'Kendaraan siap diambil.', status: 'DIAMBIL', prioritas: 'NORMAL', createdAt: new Date().toISOString() },
];

export const serviceTimelineMock = [
  { id_riwayat: 1, id_servis: 10, status: 'ANTRIAN' as const, waktu: new Date().toISOString() },
  { id_riwayat: 2, id_servis: 10, status: 'DIKERJAKAN' as const, waktu: new Date().toISOString() },
  { id_riwayat: 3, id_servis: 10, status: 'TEST_DRIVE' as const, waktu: new Date().toISOString() },
];

export const serviceDetailMock: Service = {
  id_servis: 10,
  id_wo: 101,
  keluhan: 'Mesin bergetar saat idle. Cek mounting mesin, throttle body, dan road test.',
  estimasiSelesai: new Date().toISOString(),
  status: 'DIKERJAKAN',
  prioritas: 'NORMAL',
  createdAt: new Date().toISOString(),
  riwayat: serviceTimelineMock,
};

import type { AdminSummaryItem, ServiceStatus } from './admin-dashboard-data';

export interface MechanicJobItem {
  id: string;
  vehicle: string;
  complaint: string;
  currentTask: string;
  status: ServiceStatus;
  target: string;
}

export interface MechanicTimelineItem {
  time: string;
  title: string;
  description: string;
  tone?: 'default' | 'warning' | 'danger';
}

export interface PartRequestItem {
  code: string;
  vehicle: string;
  part: string;
  qty: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
}

export interface QualityCheckItem {
  checkpoint: string;
  detail: string;
  result: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
}

export const mechanicMenus = [
  { label: 'Dashboard', to: '/dashboard/mechanic' },
  { label: 'Tugas Aktif', to: '/dashboard/mechanic/jobs' },
  { label: 'Timeline Kerja', to: '/dashboard/mechanic/timeline' },
  { label: 'Permintaan Part', to: '/dashboard/mechanic/parts' },
  { label: 'Final Check', to: '/dashboard/mechanic/final-check' },
];

export const mechanicSummary: AdminSummaryItem[] = [
  {
    label: 'Job Aktif',
    value: '4',
    hint: 'Unit sedang saya tangani',
    trend: '2 progres tinggi',
  },
  {
    label: 'Target Selesai',
    value: '16:30',
    hint: 'Berdasarkan job terlama hari ini',
    trend: 'Masih on track',
  },
  {
    label: 'Part Pending',
    value: '1',
    hint: 'Menunggu konfirmasi parts counter',
    trend: 'Perlu follow-up',
  },
  {
    label: 'QC Menunggu',
    value: '2',
    hint: 'Unit mendekati final check',
    trend: 'Siapkan test drive',
  },
];

export const jobStats: AdminSummaryItem[] = [
  {
    label: 'Antrian Saya',
    value: '1',
    hint: 'Belum mulai dikerjakan',
    trend: 'Masuk setelah stall kosong',
  },
  {
    label: 'Sedang Proses',
    value: '2',
    hint: 'Pekerjaan teknis aktif',
    trend: '1 perlu part',
  },
  {
    label: 'Siap Test Drive',
    value: '1',
    hint: 'Menunggu check akhir',
    trend: 'Bisa selesai siang',
  },
  {
    label: 'Selesai Hari Ini',
    value: '3',
    hint: 'Sudah saya tutup',
    trend: 'Rework nol',
  },
];

export const partStats: AdminSummaryItem[] = [
  {
    label: 'Request Hari Ini',
    value: '3',
    hint: 'Part yang sudah saya ajukan',
    trend: '2 approved',
  },
  {
    label: 'Pending Counter',
    value: '1',
    hint: 'Masih menunggu stok',
    trend: 'Harus dicek lagi',
  },
  {
    label: 'Fast Moving',
    value: '2',
    hint: 'Sudah tersedia',
    trend: 'Siap ambil',
  },
  {
    label: 'Need Approval',
    value: '1',
    hint: 'Perlu konfirmasi manager',
    trend: 'Belum ditutup',
  },
];

export const qualityStats: AdminSummaryItem[] = [
  {
    label: 'Checklist Final',
    value: '5',
    hint: 'Unit yang harus diperiksa',
    trend: '2 urgent',
  },
  {
    label: 'Test Drive Pending',
    value: '1',
    hint: 'Belum dapat slot',
    trend: 'Setelah makan siang',
  },
  {
    label: 'Clean Finish',
    value: '3',
    hint: 'Siap ke QC lane',
    trend: 'Semua lolos awal',
  },
  {
    label: 'Re-check',
    value: '0',
    hint: 'Tidak ada masalah ulang',
    trend: 'Bagus',
  },
];

export const mechanicJobs: MechanicJobItem[] = [
  {
    id: 'WO-260326-018',
    vehicle: 'JAECOO J7 • AB 1234 YK',
    complaint: 'Brake feel bergetar pada kecepatan tinggi',
    currentTask: 'Bongkar brake depan dan ukur ketebalan disc',
    status: 'PROSES_SERVIS',
    target: '11:30',
  },
  {
    id: 'WO-260326-020',
    vehicle: 'JAECOO J7 SHS • AB 9002 ZZ',
    complaint: 'Notifikasi hybrid cooling system',
    currentTask: 'Tunggu hose baru dari parts counter',
    status: 'TERKENDALA',
    target: 'Menunggu part',
  },
  {
    id: 'WO-260326-022',
    vehicle: 'JAECOO J8 • AB 2234 UV',
    complaint: 'Periodic service 20.000 km',
    currentTask: 'Selesai, siap final check dan road test singkat',
    status: 'SIAP_TEST_DRIVE',
    target: '13:10',
  },
  {
    id: 'WO-260326-023',
    vehicle: 'JAECOO J7 • AB 6631 HD',
    complaint: 'General check up',
    currentTask: 'Menunggu stall setelah quick job selesai',
    status: 'ANTRIAN',
    target: '14:00',
  },
];

export const mechanicTimeline: MechanicTimelineItem[] = [
  {
    time: '08:10',
    title: 'Ambil job pertama dari front desk',
    description: 'WO-260326-018 masuk ke stall 02 dan mulai inspeksi brake depan.',
    tone: 'default',
  },
  {
    time: '09:05',
    title: 'Ajukan request part',
    description: 'Cooling hose untuk WO-260326-020 diminta ke parts counter.',
    tone: 'warning',
  },
  {
    time: '10:20',
    title: 'Update progress ke manager service',
    description: 'Sampaikan bahwa satu unit menunggu part dan satu unit siap final check.',
    tone: 'default',
  },
  {
    time: '11:00',
    title: 'Siapkan unit untuk test drive',
    description: 'WO-260326-022 akan dipindah ke final check lane setelah checklist dasar selesai.',
    tone: 'default',
  },
];

export const partRequests: PartRequestItem[] = [
  {
    code: 'PRT-018',
    vehicle: 'AB 9002 ZZ • JAECOO J7 SHS',
    part: 'Cooling hose hybrid system',
    qty: '1 pcs',
    status: 'Pending',
  },
  {
    code: 'PRT-019',
    vehicle: 'AB 1234 YK • JAECOO J7',
    part: 'Brake cleaner + pad shim set',
    qty: '1 set',
    status: 'Aktif',
  },
  {
    code: 'PRT-020',
    vehicle: 'AB 2234 UV • JAECOO J8',
    part: 'Oil filter periodic package',
    qty: '1 pcs',
    status: 'Nonaktif',
  },
];

export const qualityChecks: QualityCheckItem[] = [
  {
    checkpoint: 'Torque wheel nut',
    detail: 'Pastikan semua wheel nut sesuai standar torsi',
    result: 'Sesuai',
    status: 'Aktif',
  },
  {
    checkpoint: 'Fluid level',
    detail: 'Engine oil, coolant, dan washer fluid dicek ulang',
    result: 'Sesuai',
    status: 'Aktif',
  },
  {
    checkpoint: 'Road test note',
    detail: 'Catatan perilaku kendaraan setelah pekerjaan selesai',
    result: 'Menunggu test drive',
    status: 'Pending',
  },
  {
    checkpoint: 'Cabin cleanliness',
    detail: 'Pastikan interior tetap bersih sebelum serah ke front desk',
    result: 'Sudah dicek',
    status: 'Aktif',
  },
];

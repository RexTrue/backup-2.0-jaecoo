import type { AdminSummaryItem, ServiceStatus } from './admin-dashboard-data';

export interface ManagerQueueItem {
  id: string;
  vehicle: string;
  customer: string;
  serviceAdvisor: string;
  stall: string;
  status: ServiceStatus;
  eta: string;
}

export interface TechnicianLoadItem {
  name: string;
  specialty: string;
  activeJobs: string;
  utilization: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
}

export interface ApprovalItem {
  code: string;
  subject: string;
  owner: string;
  status: 'Pending' | 'Aktif' | 'Nonaktif';
  note: string;
}

export interface BlockerItem {
  code: string;
  vehicle: string;
  blocker: string;
  owner: string;
  status: ServiceStatus;
}

export interface QualityGateItem {
  checkpoint: string;
  target: string;
  actual: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
}

export interface TimelineItem {
  title: string;
  description: string;
  time: string;
  tone?: 'default' | 'warning' | 'danger';
}

export const managerMenus = [
  { label: 'Dashboard', to: '/dashboard/service-manager' },
  { label: 'Kontrol Antrian', to: '/dashboard/service-manager/queue' },
  { label: 'Beban Mekanik', to: '/dashboard/service-manager/technicians' },
  { label: 'Persetujuan', to: '/dashboard/service-manager/approvals' },
  { label: 'Quality Gate', to: '/dashboard/service-manager/quality' },
  { label: 'Kendala & Eskalasi', to: '/dashboard/service-manager/blockers' },
  { label: 'Laporan Shift', to: '/dashboard/service-manager/reports' },
];

export const managerSummary: AdminSummaryItem[] = [
  {
    label: 'WO Aktif Shift Ini',
    value: '18',
    hint: 'Unit masih bergerak di workshop',
    trend: '3 perlu keputusan cepat',
  },
  {
    label: 'Stall Terpakai',
    value: '7 / 9',
    hint: 'Dua stall masih tersedia',
    trend: '1 stall untuk quick job',
  },
  {
    label: 'Mekanik On Duty',
    value: '11',
    hint: 'Tersebar di general, hybrid, dan QC',
    trend: '2 senior lead aktif',
  },
  {
    label: 'Case Terkendala',
    value: '2',
    hint: 'Part dan approval customer',
    trend: '1 harus dihubungi sekarang',
  },
];

export const queueStats: AdminSummaryItem[] = [
  {
    label: 'Antrian Masuk',
    value: '6',
    hint: 'Belum masuk stall',
    trend: 'Mayoritas periodic service',
  },
  {
    label: 'Sedang Dikerjakan',
    value: '8',
    hint: 'Dalam proses teknis',
    trend: '2 hampir selesai',
  },
  {
    label: 'Siap Test Drive',
    value: '2',
    hint: 'Menunggu final check',
    trend: 'Perlu test route singkat',
  },
  {
    label: 'Selesai Hari Ini',
    value: '9',
    hint: 'Siap diserahkan ke front desk',
    trend: '+2 dari target',
  },
];

export const technicianStats: AdminSummaryItem[] = [
  {
    label: 'Mekanik Aktif',
    value: '11',
    hint: 'Shift pagi hingga sore',
    trend: 'Semua teralokasi',
  },
  {
    label: 'Utilisasi Rata-rata',
    value: '84%',
    hint: 'Beban kerja workshop',
    trend: 'Masih sehat',
  },
  {
    label: 'Quick Job Slot',
    value: '2',
    hint: 'Tersisa untuk layanan singkat',
    trend: 'Bisa dipakai sekarang',
  },
  {
    label: 'QC Standby',
    value: '1',
    hint: 'Siap final check',
    trend: 'Tidak ada antrean panjang',
  },
];

export const approvalStats: AdminSummaryItem[] = [
  {
    label: 'Approval Pending',
    value: '4',
    hint: 'Perlu keputusan manager service',
    trend: '2 terkait part',
  },
  {
    label: 'Customer Contacted',
    value: '3',
    hint: 'Sudah dijelaskan estimasi biaya',
    trend: '1 menunggu jawaban',
  },
  {
    label: 'Overtime Request',
    value: '1',
    hint: 'Perlu otorisasi jika diteruskan',
    trend: 'Malam ini',
  },
  {
    label: 'Escalation Open',
    value: '2',
    hint: 'Belum ditutup di sistem',
    trend: 'Harus dipantau',
  },
];

export const qualityStats: AdminSummaryItem[] = [
  {
    label: 'QC Hari Ini',
    value: '12',
    hint: 'Unit yang sudah final check',
    trend: '10 lolos pertama',
  },
  {
    label: 'Repeat Finding',
    value: '1',
    hint: 'Masuk ulang ke stall',
    trend: 'Brake feel',
  },
  {
    label: 'Test Drive Pending',
    value: '2',
    hint: 'Belum mendapat slot jalan',
    trend: 'Siang ini selesai',
  },
  {
    label: 'Delivery Ready',
    value: '7',
    hint: 'Bisa diteruskan ke front desk',
    trend: 'Target tercapai',
  },
];

export const reportStats: AdminSummaryItem[] = [
  {
    label: 'Ringkasan Shift',
    value: '1',
    hint: 'Siap dikirim sore ini',
    trend: 'Update otomatis',
  },
  {
    label: 'Produktivitas Stall',
    value: '88%',
    hint: 'Di atas baseline minggu ini',
    trend: '+4%',
  },
  {
    label: 'Case Follow-up',
    value: '3',
    hint: 'Perlu dibawa ke besok pagi',
    trend: '1 high priority',
  },
  {
    label: 'Catatan Safety',
    value: '0',
    hint: 'Tidak ada insiden tercatat',
    trend: 'Aman',
  },
];

export const managerAttention: TimelineItem[] = [
  {
    title: 'WO-260326-021 menunggu approval customer',
    description: 'Tambahan brake cleaning dan spooring sudah dijelaskan, namun konfirmasi belum masuk.',
    time: '10:15',
    tone: 'warning',
  },
  {
    title: 'Hybrid bay penuh hingga 14:00',
    description: 'Jadwalkan unit SHS berikutnya setelah battery inspection selesai.',
    time: '09:40',
    tone: 'default',
  },
  {
    title: 'Part inbound untuk kasus terkendala belum tiba',
    description: 'Perlu follow-up ke parts counter sebelum briefing siang.',
    time: '09:05',
    tone: 'danger',
  },
];

export const managerQueue: ManagerQueueItem[] = [
  {
    id: 'WO-260326-018',
    vehicle: 'JAECOO J7 • AB 1234 YK',
    customer: 'Rangga Pradana',
    serviceAdvisor: 'Nadia Putri',
    stall: 'Stall 02',
    status: 'PROSES_SERVIS',
    eta: '11:30',
  },
  {
    id: 'WO-260326-019',
    vehicle: 'JAECOO J8 • AB 8441 KT',
    customer: 'Ayu Maharani',
    serviceAdvisor: 'Alya Safitri',
    stall: 'QC Lane',
    status: 'SIAP_TEST_DRIVE',
    eta: '12:10',
  },
  {
    id: 'WO-260326-020',
    vehicle: 'JAECOO J7 SHS • AB 9002 ZZ',
    customer: 'Budi Santoso',
    serviceAdvisor: 'Fikri Ramadhan',
    stall: 'Hybrid Bay',
    status: 'TERKENDALA',
    eta: 'Menunggu part',
  },
  {
    id: 'WO-260326-021',
    vehicle: 'JAECOO J7 • AB 7711 CN',
    customer: 'Christina Dewi',
    serviceAdvisor: 'Nadia Putri',
    stall: 'Pre-Check',
    status: 'ANTRIAN',
    eta: '12:45',
  },
  {
    id: 'WO-260326-022',
    vehicle: 'JAECOO J8 • AB 2234 UV',
    customer: 'Yoga Prasetyo',
    serviceAdvisor: 'Alya Safitri',
    stall: 'Final Wash',
    status: 'SELESAI',
    eta: 'Siap serah',
  },
];

export const technicianLoad: TechnicianLoadItem[] = [
  {
    name: 'Bima Alfarizi',
    specialty: 'General Repair',
    activeJobs: '2 job',
    utilization: '87%',
    status: 'Aktif',
  },
  {
    name: 'Rizky Fadila',
    specialty: 'Periodic Service',
    activeJobs: '3 job',
    utilization: '92%',
    status: 'Aktif',
  },
  {
    name: 'Farhan Aji',
    specialty: 'Hybrid System',
    activeJobs: '1 job',
    utilization: '74%',
    status: 'Aktif',
  },
  {
    name: 'Dimas Prakoso',
    specialty: 'QC & Test Drive',
    activeJobs: '1 lane',
    utilization: '68%',
    status: 'Pending',
  },
];

export const approvals: ApprovalItem[] = [
  {
    code: 'APR-101',
    subject: 'Tambahan brake cleaning + spooring',
    owner: 'WO-260326-021 • Nadia Putri',
    status: 'Pending',
    note: 'Menunggu jawaban customer sebelum stall dialihkan.',
  },
  {
    code: 'APR-102',
    subject: 'Lembur 1 mekanik untuk unit fleet',
    owner: 'Workshop Lead',
    status: 'Aktif',
    note: 'Masih sesuai kapasitas jika approval diberikan sebelum 15:00.',
  },
  {
    code: 'APR-103',
    subject: 'Penggantian part fast moving',
    owner: 'WO-260326-020 • Fikri Ramadhan',
    status: 'Pending',
    note: 'Alternatif part perlu dikonfirmasi ke parts counter.',
  },
];

export const blockers: BlockerItem[] = [
  {
    code: 'BLK-21',
    vehicle: 'AB 9002 ZZ • JAECOO J7 SHS',
    blocker: 'Part battery cooling hose belum inbound',
    owner: 'Parts Counter',
    status: 'TERKENDALA',
  },
  {
    code: 'BLK-22',
    vehicle: 'AB 7711 CN • JAECOO J7',
    blocker: 'Approval customer belum masuk',
    owner: 'Front Desk',
    status: 'ANTRIAN',
  },
  {
    code: 'BLK-23',
    vehicle: 'AB 8441 KT • JAECOO J8',
    blocker: 'Test drive slot penuh hingga 11:45',
    owner: 'QC Lane',
    status: 'SIAP_TEST_DRIVE',
  },
];

export const qualityGates: QualityGateItem[] = [
  {
    checkpoint: 'First time fix',
    target: '≥ 95%',
    actual: '94%',
    status: 'Pending',
  },
  {
    checkpoint: 'On time delivery',
    target: '≥ 90%',
    actual: '92%',
    status: 'Aktif',
  },
  {
    checkpoint: 'Rework case',
    target: '< 2 kasus',
    actual: '1 kasus',
    status: 'Aktif',
  },
  {
    checkpoint: 'Case escalation',
    target: '< 3 open',
    actual: '2 open',
    status: 'Aktif',
  },
];

export const shiftReports: TimelineItem[] = [
  {
    title: 'Produktivitas stall tetap stabil',
    description: 'Kapasitas workshop masih sehat untuk menerima 2 quick job tambahan.',
    time: '10:30',
    tone: 'default',
  },
  {
    title: 'Satu kasus part perlu dibawa ke sore hari',
    description: 'Manager service perlu memberi catatan handover agar tidak terlewat saat pergantian shift.',
    time: '10:10',
    tone: 'warning',
  },
  {
    title: 'Tidak ada insiden safety pada shift pagi',
    description: 'Workshop berjalan normal dengan briefing pembuka yang lengkap.',
    time: '08:15',
    tone: 'default',
  },
];

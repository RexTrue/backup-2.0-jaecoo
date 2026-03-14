import type { AdminSummaryItem, ServiceStatus } from './admin-dashboard-data';

export interface FrontDeskReceptionItem {
  code: string;
  customer: string;
  vehicle: string;
  appointment: string;
  status: ServiceStatus;
}

export interface FrontDeskBookingItem {
  slot: string;
  advisor: string;
  serviceType: string;
  customer: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
}

export interface FrontDeskApprovalItem {
  code: string;
  customer: string;
  subject: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
  note: string;
}

export interface FrontDeskDeliveryItem {
  workOrder: string;
  vehicle: string;
  readiness: string;
  status: ServiceStatus;
}

export interface FrontDeskFollowUpItem {
  customer: string;
  channel: string;
  purpose: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
}

export interface FrontDeskTimelineItem {
  time: string;
  title: string;
  description: string;
  tone?: 'default' | 'warning' | 'danger';
}

export const frontDeskMenus = [
  { label: 'Dashboard', to: '/dashboard/front-desk' },
  { label: 'Penerimaan Unit', to: '/dashboard/front-desk/reception' },
  { label: 'Jadwal & Booking', to: '/dashboard/front-desk/bookings' },
  { label: 'Persetujuan Customer', to: '/dashboard/front-desk/approvals' },
  { label: 'Serah Terima', to: '/dashboard/front-desk/deliveries' },
  { label: 'Follow-up Customer', to: '/dashboard/front-desk/follow-ups' },
];

export const frontDeskSummary: AdminSummaryItem[] = [
  { label: 'Check-in Hari Ini', value: '14', hint: 'Unit yang sudah diterima', trend: '4 masih menunggu stall' },
  { label: 'Booking Besok', value: '9', hint: 'Sudah terjadwal', trend: '2 quick service' },
  { label: 'Approval Pending', value: '3', hint: 'Perlu jawaban customer', trend: '1 urgent' },
  { label: 'Siap Diserahkan', value: '6', hint: 'Unit selesai & siap delivery', trend: '2 selesai siang ini' },
];

export const receptionStats: AdminSummaryItem[] = [
  { label: 'Antrian Masuk', value: '5', hint: 'Belum mulai proses servis', trend: 'Mayoritas periodic' },
  { label: 'Sudah Check-in', value: '14', hint: 'Dokumen lengkap', trend: 'Semua tercatat' },
  { label: 'Estimasi Dijelaskan', value: '11', hint: 'Sudah dijelaskan ke customer', trend: '3 masih pending' },
  { label: 'VIP Arrival', value: '1', hint: 'Perlu penanganan cepat', trend: 'Datang 10:30' },
];

export const bookingStats: AdminSummaryItem[] = [
  { label: 'Slot Tersedia', value: '7', hint: 'Masih bisa dibuka', trend: 'Pagi lebih longgar' },
  { label: 'Booking Confirmed', value: '12', hint: 'Sudah terjadwal', trend: '6 untuk besok' },
  { label: 'Reschedule', value: '2', hint: 'Butuh penyesuaian waktu', trend: 'Perlu follow-up' },
  { label: 'Walk-in Estimate', value: '3', hint: 'Perlu slot cadangan', trend: 'Siang hari' },
];

export const approvalStats: AdminSummaryItem[] = [
  { label: 'Approval Open', value: '3', hint: 'Butuh jawaban customer', trend: '1 urgent' },
  { label: 'Sudah Dijelaskan', value: '5', hint: 'Estimasi biaya/part', trend: '2 menunggu balasan' },
  { label: 'Approved', value: '4', hint: 'Bisa diteruskan ke workshop', trend: 'Semua tercatat' },
  { label: 'Declined', value: '1', hint: 'Perlu revisi pekerjaan', trend: 'Kasus minor' },
];

export const deliveryStats: AdminSummaryItem[] = [
  { label: 'Ready Delivery', value: '6', hint: 'Siap diserahkan hari ini', trend: '3 sebelum 15:00' },
  { label: 'Menunggu Invoice', value: '2', hint: 'Belum final billing', trend: 'Segera selesai' },
  { label: 'Sudah Diambil', value: '8', hint: 'Unit telah keluar', trend: 'On time' },
  { label: 'Reminder Pickup', value: '2', hint: 'Perlu dihubungi ulang', trend: 'Sore ini' },
];

export const followUpStats: AdminSummaryItem[] = [
  { label: 'Follow-up Hari Ini', value: '9', hint: 'Call & WhatsApp customer', trend: '3 belum terhubung' },
  { label: 'Feedback Masuk', value: '4', hint: 'Setelah delivery', trend: 'Mayoritas positif' },
  { label: 'Reminder Booking', value: '5', hint: 'Untuk hari berikutnya', trend: 'Pagi lebih efektif' },
  { label: 'Case Terkendala', value: '1', hint: 'Perlu update status khusus', trend: 'Pantau terus' },
];

export const frontDeskTimeline: FrontDeskTimelineItem[] = [
  {
    time: '08:15',
    title: 'Check-in unit periodic service',
    description: 'Data kendaraan, keluhan, dan estimasi selesai sudah dijelaskan ke customer.',
    tone: 'default',
  },
  {
    time: '09:40',
    title: 'Konfirmasi approval tambahan pekerjaan',
    description: 'Customer menyetujui spooring dan balancing setelah dijelaskan estimasi biaya.',
    tone: 'warning',
  },
  {
    time: '11:10',
    title: 'Siapkan serah terima unit selesai',
    description: 'Pastikan invoice, QC note, dan penjelasan pekerjaan siap sebelum customer datang.',
    tone: 'default',
  },
];

export const frontDeskReception: FrontDeskReceptionItem[] = [
  { code: 'RCP-026', customer: 'Nabila Sari', vehicle: 'JAECOO J7 • AB 1234 YK', appointment: '08:30', status: 'ANTRIAN' },
  { code: 'RCP-027', customer: 'Dewa Prasetyo', vehicle: 'JAECOO J8 • AB 7788 TR', appointment: '09:00', status: 'PROSES_SERVIS' },
  { code: 'RCP-028', customer: 'Rina Maheswari', vehicle: 'JAECOO J7 SHS • AB 9911 KD', appointment: '10:00', status: 'TERKENDALA' },
  { code: 'RCP-029', customer: 'Arga Saputra', vehicle: 'JAECOO J7 • AB 5512 MC', appointment: '11:00', status: 'SELESAI' },
];

export const frontDeskBookings: FrontDeskBookingItem[] = [
  { slot: '08:00 - 09:00', advisor: 'Alya', serviceType: 'Periodic 10.000 km', customer: 'Hadi Santoso', status: 'Aktif' },
  { slot: '09:00 - 10:00', advisor: 'Nadia', serviceType: 'General Check Up', customer: 'Laras Putri', status: 'Aktif' },
  { slot: '10:00 - 11:00', advisor: 'Alya', serviceType: 'Quick Service', customer: 'Bimo Ardi', status: 'Pending' },
  { slot: '13:00 - 14:00', advisor: 'Nadia', serviceType: 'Body & Noise Check', customer: 'Yuni Kartika', status: 'Nonaktif' },
];

export const frontDeskApprovals: FrontDeskApprovalItem[] = [
  { code: 'APR-011', customer: 'Rina Maheswari', subject: 'Hybrid hose replacement', status: 'Pending', note: 'Customer minta penjelasan ulang biaya.' },
  { code: 'APR-012', customer: 'Dewa Prasetyo', subject: 'Spooring & balancing', status: 'Aktif', note: 'Sudah disetujui melalui WhatsApp.' },
  { code: 'APR-013', customer: 'Arga Saputra', subject: 'Cabin filter replacement', status: 'Nonaktif', note: 'Ditunda untuk servis berikutnya.' },
];

export const frontDeskDeliveries: FrontDeskDeliveryItem[] = [
  { workOrder: 'WO-260326-031', vehicle: 'JAECOO J7 • AB 5512 MC', readiness: 'Invoice selesai, QC lengkap', status: 'SELESAI' },
  { workOrder: 'WO-260326-032', vehicle: 'JAECOO J8 • AB 1224 ST', readiness: 'Siap dijelaskan hasil pekerjaan', status: 'SIAP_TEST_DRIVE' },
  { workOrder: 'WO-260326-033', vehicle: 'JAECOO J7 SHS • AB 9911 KD', readiness: 'Menunggu konfirmasi pickup', status: 'SELESAI' },
  { workOrder: 'WO-260326-029', vehicle: 'JAECOO J7 • AB 4412 UH', readiness: 'Sudah diserahkan ke customer', status: 'DIAMBIL' },
];

export const frontDeskFollowUps: FrontDeskFollowUpItem[] = [
  { customer: 'Nabila Sari', channel: 'WhatsApp', purpose: 'Reminder estimasi selesai pukul 14:30', status: 'Aktif' },
  { customer: 'Rina Maheswari', channel: 'Telepon', purpose: 'Konfirmasi approval pekerjaan tambahan', status: 'Pending' },
  { customer: 'Arga Saputra', channel: 'WhatsApp', purpose: 'Ucapan terima kasih setelah delivery', status: 'Nonaktif' },
  { customer: 'Dewa Prasetyo', channel: 'Telepon', purpose: 'Konfirmasi unit siap diambil', status: 'Aktif' },
];

export type ServiceStatus =
  | 'ANTRIAN'
  | 'PROSES_SERVIS'
  | 'SIAP_TEST_DRIVE'
  | 'SELESAI'
  | 'DIAMBIL'
  | 'TERKENDALA';

export interface AdminSummaryItem {
  label: string;
  value: string;
  hint: string;
  trend: string;
}

export interface WorkOrderItem {
  id: string;
  customer: string;
  vehicle: string;
  advisor: string;
  status: ServiceStatus;
  eta: string;
}

export interface UserActivityItem {
  name: string;
  role: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
  updatedAt: string;
}

export interface AttentionItem {
  title: string;
  description: string;
  tone: 'default' | 'warning' | 'danger';
}

export interface MasterServiceItem {
  name: string;
  category: string;
  duration: string;
}

export interface CustomerItem {
  nik: string;
  name: string;
  phone: string;
  city: string;
  vehicles: string;
}

export interface VehicleItem {
  plateNumber: string;
  model: string;
  owner: string;
  mileage: string;
  status: ServiceStatus;
}

export interface ReportItem {
  title: string;
  schedule: string;
  owner: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
}

export interface SettingItem {
  module: string;
  description: string;
  value: string;
}

export const adminSummary: AdminSummaryItem[] = [
  {
    label: 'Total User',
    value: '48',
    hint: 'Seluruh akun operasional',
    trend: '+4 bulan ini',
  },
  {
    label: 'Pemilik Terdaftar',
    value: '1.126',
    hint: 'Data pelanggan aktif',
    trend: '+18 minggu ini',
  },
  {
    label: 'Data Kendaraan',
    value: '1.284',
    hint: 'Terdaftar di sistem',
    trend: '+37 minggu ini',
  },
  {
    label: 'Work Order Aktif',
    value: '26',
    hint: 'Sedang berjalan di bengkel',
    trend: '3 prioritas tinggi',
  },
];

export const systemSummary: AdminSummaryItem[] = [
  {
    label: 'Master Jenis Servis',
    value: '24',
    hint: 'Jenis servis yang siap dipakai',
    trend: '4 kategori aktif',
  },
  {
    label: 'Riwayat Hari Ini',
    value: '67',
    hint: 'Update status tercatat',
    trend: 'Semua tersimpan',
  },
  {
    label: 'Akun Pending',
    value: '2',
    hint: 'Menunggu approval admin',
    trend: 'Perlu verifikasi',
  },
  {
    label: 'Kendala Part',
    value: '1',
    hint: 'Kasus perlu follow-up',
    trend: 'Masih terbuka',
  },
];

export const userStats: AdminSummaryItem[] = [
  {
    label: 'Total Akun',
    value: '48',
    hint: 'Semua role operasional',
    trend: '4 role aktif',
  },
  {
    label: 'Mekanik',
    value: '22',
    hint: 'User dengan akses workshop',
    trend: 'Shift pagi dominan',
  },
  {
    label: 'Front Desk',
    value: '10',
    hint: 'Penerimaan & delivery',
    trend: '2 akun baru',
  },
  {
    label: 'Manager & Admin',
    value: '16',
    hint: 'Monitoring & approval',
    trend: 'Semua aktif',
  },
];

export const serviceStats: AdminSummaryItem[] = [
  {
    label: 'Jenis Servis Aktif',
    value: '24',
    hint: 'Periodic, repair, inspection',
    trend: 'Standar tersinkron',
  },
  {
    label: 'Durasi Rata-rata',
    value: '1,8 jam',
    hint: 'Estimasi pengerjaan umum',
    trend: '-10 menit vs lalu',
  },
  {
    label: 'Servis Prioritas',
    value: '5',
    hint: 'Unit VIP atau urgent',
    trend: 'Perlu slot khusus',
  },
  {
    label: 'Kelengkapan Master',
    value: '96%',
    hint: 'Siap dipakai tim frontline',
    trend: '1 item review',
  },
];

export const customerStats: AdminSummaryItem[] = [
  {
    label: 'Total Pemilik',
    value: '1.126',
    hint: 'Data customer aktif',
    trend: '+12 bulan ini',
  },
  {
    label: 'Data Lengkap',
    value: '1.004',
    hint: 'Nomor kontak valid',
    trend: '89,2% lengkap',
  },
  {
    label: 'Repeat Customer',
    value: '418',
    hint: 'Pernah servis lebih dari 1x',
    trend: '37,1% populasi',
  },
  {
    label: 'Follow-up Hari Ini',
    value: '14',
    hint: 'Butuh update dari CS',
    trend: '6 terkait invoice',
  },
];

export const vehicleStats: AdminSummaryItem[] = [
  {
    label: 'Kendaraan Aktif',
    value: '1.284',
    hint: 'Memiliki histori servis',
    trend: '+37 minggu ini',
  },
  {
    label: 'JAECOO J7',
    value: '742',
    hint: 'Model dengan populasi terbesar',
    trend: '57,8% total unit',
  },
  {
    label: 'JAECOO J8',
    value: '412',
    hint: 'Populasi premium line',
    trend: '+11 bulan ini',
  },
  {
    label: 'SHS Hybrid',
    value: '130',
    hint: 'Perlu teknisi tersertifikasi',
    trend: 'Tren naik',
  },
];

export const workOrderStats: AdminSummaryItem[] = [
  {
    label: 'WO Dibuka Hari Ini',
    value: '31',
    hint: 'Semua front desk shift pagi',
    trend: '+5 vs kemarin',
  },
  {
    label: 'Sedang Proses',
    value: '12',
    hint: 'Masih di stall bengkel',
    trend: '4 test drive pending',
  },
  {
    label: 'Selesai',
    value: '15',
    hint: 'Siap serah terima',
    trend: '3 menunggu pembayaran',
  },
  {
    label: 'Terkendala',
    value: '1',
    hint: 'Menunggu part inbound',
    trend: 'Perlu eskalasi',
  },
];

export const reportStats: AdminSummaryItem[] = [
  {
    label: 'Laporan Harian',
    value: '7',
    hint: 'Operasional siap ekspor',
    trend: 'Terbit setiap 18:00',
  },
  {
    label: 'Laporan Mingguan',
    value: '3',
    hint: 'Khusus management review',
    trend: '1 perlu approval',
  },
  {
    label: 'Template Aktif',
    value: '9',
    hint: 'Dipakai admin & manager',
    trend: 'Tidak ada error',
  },
  {
    label: 'Distribusi Otomatis',
    value: '5',
    hint: 'Kirim ke email internal',
    trend: 'Semua berjalan',
  },
];

export const settingsStats: AdminSummaryItem[] = [
  {
    label: 'Role Permission',
    value: '4',
    hint: 'Admin, manager, front desk, mekanik',
    trend: 'Struktur final',
  },
  {
    label: 'Notifikasi Aktif',
    value: '12',
    hint: 'Alert dashboard & approval',
    trend: '2 butuh revisi',
  },
  {
    label: 'Integrasi Internal',
    value: '3',
    hint: 'Auth, audit, laporan',
    trend: 'Stabil',
  },
  {
    label: 'Konfigurasi Kritis',
    value: '6',
    hint: 'Perlu akses admin',
    trend: 'Terproteksi',
  },
];

export const workOrders: WorkOrderItem[] = [
  {
    id: 'WO-260312-018',
    customer: 'Rangga Pradana',
    vehicle: 'JAECOO J7 • AB 1234 YK',
    advisor: 'Nadia Putri',
    status: 'PROSES_SERVIS',
    eta: '13:30',
  },
  {
    id: 'WO-260312-019',
    customer: 'Ayu Maharani',
    vehicle: 'JAECOO J8 • AB 8441 KT',
    advisor: 'Alya Safitri',
    status: 'SIAP_TEST_DRIVE',
    eta: '14:10',
  },
  {
    id: 'WO-260312-020',
    customer: 'Budi Santoso',
    vehicle: 'JAECOO J7 SHS • AB 9002 ZZ',
    advisor: 'Fikri Ramadhan',
    status: 'TERKENDALA',
    eta: 'Menunggu part',
  },
  {
    id: 'WO-260312-021',
    customer: 'Christina Dewi',
    vehicle: 'JAECOO J7 • AB 7711 CN',
    advisor: 'Nadia Putri',
    status: 'ANTRIAN',
    eta: '15:20',
  },
  {
    id: 'WO-260312-022',
    customer: 'Yoga Prasetyo',
    vehicle: 'JAECOO J8 • AB 2234 UV',
    advisor: 'Alya Safitri',
    status: 'SELESAI',
    eta: 'Siap invoice',
  },
  {
    id: 'WO-260312-023',
    customer: 'Sinta Maheswari',
    vehicle: 'JAECOO J7 • AB 6631 HD',
    advisor: 'Rina Oktavia',
    status: 'DIAMBIL',
    eta: 'Delivered 16:25',
  },
];

export const recentUsers: UserActivityItem[] = [
  {
    name: 'Nadia Putri',
    role: 'Front Desk',
    status: 'Aktif',
    updatedAt: '26 Mar 2026 • 08:10',
  },
  {
    name: 'Bima Alfarizi',
    role: 'Mekanik',
    status: 'Aktif',
    updatedAt: '26 Mar 2026 • 07:58',
  },
  {
    name: 'Raka Saputra',
    role: 'Manager Service',
    status: 'Pending',
    updatedAt: '25 Mar 2026 • 17:40',
  },
  {
    name: 'Dewi Larasati',
    role: 'Admin',
    status: 'Nonaktif',
    updatedAt: '25 Mar 2026 • 13:15',
  },
  {
    name: 'Salsa Nirmala',
    role: 'Front Desk',
    status: 'Aktif',
    updatedAt: '25 Mar 2026 • 10:04',
  },
];

export const masterServices: MasterServiceItem[] = [
  { name: 'Periodic Service 10.000 km', category: 'Periodic', duration: '1,5 jam' },
  { name: 'General Check Up', category: 'Inspection', duration: '45 menit' },
  { name: 'Brake Maintenance', category: 'Repair', duration: '2 jam' },
  { name: 'Software Update ECU', category: 'Software', duration: '30 menit' },
  { name: 'Battery Health Scan', category: 'Inspection', duration: '25 menit' },
  { name: 'AC Performance Treatment', category: 'Repair', duration: '1 jam' },
];

export const customers: CustomerItem[] = [
  {
    nik: '3402151201900001',
    name: 'Rangga Pradana',
    phone: '0812-3434-8890',
    city: 'Sleman',
    vehicles: '2 unit',
  },
  {
    nik: '3404131502910002',
    name: 'Ayu Maharani',
    phone: '0813-9001-2204',
    city: 'Yogyakarta',
    vehicles: '1 unit',
  },
  {
    nik: '3402153008880003',
    name: 'Budi Santoso',
    phone: '0821-1122-3309',
    city: 'Bantul',
    vehicles: '1 unit',
  },
  {
    nik: '3471011709920004',
    name: 'Sinta Maheswari',
    phone: '0819-2222-1808',
    city: 'Kulon Progo',
    vehicles: '3 unit',
  },
  {
    nik: '3471050806950005',
    name: 'Christina Dewi',
    phone: '0857-6654-2011',
    city: 'Gunungkidul',
    vehicles: '1 unit',
  },
];

export const vehicles: VehicleItem[] = [
  {
    plateNumber: 'AB 1234 YK',
    model: 'JAECOO J7',
    owner: 'Rangga Pradana',
    mileage: '18.240 km',
    status: 'PROSES_SERVIS',
  },
  {
    plateNumber: 'AB 8441 KT',
    model: 'JAECOO J8',
    owner: 'Ayu Maharani',
    mileage: '9.180 km',
    status: 'SIAP_TEST_DRIVE',
  },
  {
    plateNumber: 'AB 9002 ZZ',
    model: 'JAECOO J7 SHS',
    owner: 'Budi Santoso',
    mileage: '23.900 km',
    status: 'TERKENDALA',
  },
  {
    plateNumber: 'AB 7711 CN',
    model: 'JAECOO J7',
    owner: 'Christina Dewi',
    mileage: '12.044 km',
    status: 'ANTRIAN',
  },
  {
    plateNumber: 'AB 2234 UV',
    model: 'JAECOO J8',
    owner: 'Yoga Prasetyo',
    mileage: '15.320 km',
    status: 'SELESAI',
  },
];

export const reports: ReportItem[] = [
  {
    title: 'Rekap Work Order Harian',
    schedule: 'Setiap hari • 18:00',
    owner: 'Admin Service',
    status: 'Aktif',
  },
  {
    title: 'Monitoring Kendala & Part',
    schedule: 'Setiap hari • 16:00',
    owner: 'Manager Service',
    status: 'Aktif',
  },
  {
    title: 'Distribusi Beban Mekanik',
    schedule: 'Setiap Senin • 08:00',
    owner: 'Workshop Controller',
    status: 'Pending',
  },
  {
    title: 'Audit Data Pelanggan',
    schedule: 'Setiap Jumat • 15:30',
    owner: 'Admin CRM',
    status: 'Nonaktif',
  },
];

export const settings: SettingItem[] = [
  {
    module: 'Role & Permission',
    description: 'Akses dashboard dan otorisasi endpoint per role.',
    value: '4 role aktif',
  },
  {
    module: 'Approval User Baru',
    description: 'Aktifkan approval admin sebelum akun dapat login.',
    value: 'Enabled',
  },
  {
    module: 'SLA Work Order',
    description: 'Batas waktu notifikasi saat unit tertahan terlalu lama.',
    value: '4 jam',
  },
  {
    module: 'Ekspor Laporan',
    description: 'Template ekspor PDF dan spreadsheet operasional.',
    value: 'Siap pakai',
  },
];

export const attentionItems: AttentionItem[] = [
  {
    title: '2 akun masih pending approval',
    description: 'Periksa role dan akses sebelum dipakai operasional hari ini.',
    tone: 'warning',
  },
  {
    title: '1 work order terkendala lebih dari 4 jam',
    description: 'WO-260312-020 menunggu sparepart brake pad depan.',
    tone: 'danger',
  },
  {
    title: '14 kendaraan baru belum memiliki data asuransi',
    description: 'Lengkapi metadata pelanggan untuk kebutuhan laporan dealer.',
    tone: 'default',
  },
];

export const quickActions = [
  'Tambah user operasional baru',
  'Buat master jenis servis',
  'Validasi data pemilik & kendaraan',
  'Pantau work order prioritas tinggi',
];

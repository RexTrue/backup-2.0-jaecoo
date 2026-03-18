import { Role, ServiceStatus } from '@/common/types/domain';
import { DashboardConfig } from '@/modules/dashboard/types/dashboard.types';
import { dashboardTone as tone } from '@/modules/dashboard/lib/dashboard-tone';

const adminConfig: DashboardConfig = {
  eyebrow: 'Admin',
  heading: 'Overview',
  heroImage: '/assets/img3.webp',
  focusCards: [
    { label: 'Terkendala', value: '2 unit', chip: 'Perlu tindak lanjut', tone: tone.danger, href: '/services' },
    { label: 'Siap Test Drive', value: '3 unit', chip: 'Butuh validasi', tone: tone.info, href: '/services' },
    { label: 'Siap Diambil', value: '4 unit', chip: 'Menunggu frontdesk', tone: tone.success, href: '/services' },
    { label: 'Antrian Baru', value: '5 unit', chip: 'Masuk hari ini', tone: tone.warning, href: '/work-orders' },
  ],
  kpis: [
    { label: 'Kendaraan Masuk', value: '18', chip: '+4', tone: tone.info, href: '/vehicles' },
    { label: 'Servis Aktif', value: '11', chip: '+2', tone: tone.warning, href: '/services' },
    { label: 'Selesai Hari Ini', value: '7', chip: '+3', tone: tone.success, href: '/services' },
    { label: 'Terkendala', value: '2', chip: 'Watch', tone: tone.danger, href: '/services' },
  ],
  statusCounts: { ANTRIAN: 5, DIKERJAKAN: 4, TEST_DRIVE: 3, SELESAI: 4, DIAMBIL: 2, TERKENDALA: 2 },
  timeline: [
    { time: '11:24', text: 'WO-240603 berpindah ke test drive', status: 'TEST_DRIVE' },
    { time: '11:05', text: 'WO-240604 ditandai terkendala', status: 'TERKENDALA' },
    { time: '10:42', text: 'WO-240601 mulai dikerjakan', status: 'DIKERJAKAN' },
    { time: '10:10', text: 'WO-240602 masuk antrian', status: 'ANTRIAN' },
  ],
  activeList: [
    { wo: 'WO-240601', plate: 'AB 1234 YK', model: 'J7', status: 'DIKERJAKAN', time: '08:30' },
    { wo: 'WO-240602', plate: 'AB 8890 LX', model: 'J8', status: 'ANTRIAN', time: '09:10' },
    { wo: 'WO-240603', plate: 'AB 9901 QA', model: 'J7', status: 'TEST_DRIVE', time: '10:15' },
    { wo: 'WO-240604', plate: 'AB 4411 BX', model: 'J8', status: 'TERKENDALA', time: '11:00' },
  ],
  priorityList: [
    { title: 'Unit menunggu keputusan', status: 'TERKENDALA', note: 'Konfirmasi sparepart dan estimasi baru', href: '/services' },
    { title: 'Unit siap test drive', status: 'TEST_DRIVE', note: 'Validasi hasil pengerjaan sebelum diserahkan', href: '/services' },
    { title: 'Unit siap diambil', status: 'SELESAI', note: 'Konfirmasi dokumen dan serah terima', href: '/services' },
  ],
};

const managerConfig: DashboardConfig = {
  eyebrow: 'Manajer',
  heading: 'Monitoring',
  heroImage: '/assets/img1.jpg',
  focusCards: [
    { label: 'Terkendala', value: '3 unit', chip: 'Prioritas', tone: tone.danger, href: '/services' },
    { label: 'Proses Servis', value: '6 unit', chip: 'Beban bengkel', tone: tone.warning, href: '/services' },
    { label: 'Siap Test Drive', value: '2 unit', chip: 'QC', tone: tone.info, href: '/services' },
    { label: 'Siap Diambil', value: '5 unit', chip: 'Output hari ini', tone: tone.success, href: '/services' },
  ],
  kpis: [
    { label: 'WO Hari Ini', value: '14', chip: '+2', tone: tone.info, href: '/work-orders' },
    { label: 'Servis Aktif', value: '13', chip: '+1', tone: tone.warning, href: '/services' },
    { label: 'Test Drive', value: '2', chip: 'QC', tone: tone.info, href: '/services' },
    { label: 'Terkendala', value: '3', chip: 'Watch', tone: tone.danger, href: '/services' },
  ],
  statusCounts: { ANTRIAN: 4, DIKERJAKAN: 6, TEST_DRIVE: 2, SELESAI: 5, DIAMBIL: 2, TERKENDALA: 3 },
  timeline: [
    { time: '11:40', text: 'WO-240607 menunggu approval tambahan', status: 'TERKENDALA' },
    { time: '11:18', text: 'WO-240603 siap test drive', status: 'TEST_DRIVE' },
    { time: '10:58', text: 'WO-240601 masih proses servis', status: 'DIKERJAKAN' },
    { time: '10:22', text: 'WO-240605 masuk antrian', status: 'ANTRIAN' },
  ],
  activeList: [
    { wo: 'WO-240601', plate: 'AB 1234 YK', model: 'J7', status: 'DIKERJAKAN', time: '08:30' },
    { wo: 'WO-240603', plate: 'AB 9901 QA', model: 'J7', status: 'TEST_DRIVE', time: '10:15' },
    { wo: 'WO-240607', plate: 'AB 1199 JL', model: 'J8', status: 'TERKENDALA', time: '11:05' },
    { wo: 'WO-240608', plate: 'AB 7743 PL', model: 'J7', status: 'SELESAI', time: '11:20' },
  ],
  priorityList: [
    { title: 'Approval tambahan', status: 'TERKENDALA', note: 'Tentukan keputusan untuk WO-240607', href: '/services' },
    { title: 'QC siang ini', status: 'TEST_DRIVE', note: '2 unit perlu test drive final', href: '/services' },
    { title: 'Output selesai', status: 'SELESAI', note: '5 unit siap tutup hari ini', href: '/services' },
  ],
};

const frontlineConfig: DashboardConfig = {
  eyebrow: 'Frontdesk',
  heading: 'Desk Overview',
  heroImage: '/assets/img2.webp',
  focusCards: [
    { label: 'Menunggu Pengambilan', value: '4 unit', chip: 'Siap hubungi', tone: tone.success, href: '/services' },
    { label: 'Antrian Masuk', value: '6 unit', chip: 'Check-in', tone: tone.warning, href: '/work-orders' },
    { label: 'Terkendala', value: '2 unit', chip: 'Perlu update pelanggan', tone: tone.danger, href: '/services' },
    { label: 'Siap Test Drive', value: '1 unit', chip: 'Koordinasi', tone: tone.info, href: '/services' },
  ],
  kpis: [
    { label: 'Check-in Hari Ini', value: '12', chip: '+3', tone: tone.info, href: '/work-orders' },
    { label: 'Siap Diambil', value: '4', chip: 'Call', tone: tone.success, href: '/services' },
    { label: 'Antrian', value: '6', chip: 'Desk', tone: tone.warning, href: '/services' },
    { label: 'Terkendala', value: '2', chip: 'Watch', tone: tone.danger, href: '/services' },
  ],
  statusCounts: { ANTRIAN: 6, DIKERJAKAN: 3, TEST_DRIVE: 1, SELESAI: 4, DIAMBIL: 2, TERKENDALA: 2 },
  timeline: [
    { time: '11:20', text: 'WO-240610 siap diambil', status: 'SELESAI' },
    { time: '10:55', text: 'WO-240611 masuk antrian', status: 'ANTRIAN' },
    { time: '10:40', text: 'WO-240607 perlu update ke pelanggan', status: 'TERKENDALA' },
    { time: '10:05', text: 'WO-240606 dipindah ke proses servis', status: 'DIKERJAKAN' },
  ],
  activeList: [
    { wo: 'WO-240606', plate: 'AB 5512 NT', model: 'J7', status: 'DIKERJAKAN', time: '08:10' },
    { wo: 'WO-240610', plate: 'AB 3401 BY', model: 'J8', status: 'SELESAI', time: '10:35' },
    { wo: 'WO-240611', plate: 'AB 4421 KA', model: 'J7', status: 'ANTRIAN', time: '10:50' },
    { wo: 'WO-240607', plate: 'AB 1199 JL', model: 'J8', status: 'TERKENDALA', time: '11:00' },
  ],
  priorityList: [
    { title: 'Hubungi pelanggan', status: 'SELESAI', note: '4 unit menunggu pengambilan', href: '/services' },
    { title: 'Update kendala', status: 'TERKENDALA', note: 'Sampaikan estimasi revisi ke pelanggan', href: '/services' },
    { title: 'Check-in berikutnya', status: 'ANTRIAN', note: 'Siapkan slot masuk siang ini', href: '/work-orders' },
  ],
};

const mechanicConfig: DashboardConfig = {
  eyebrow: 'Mekanik',
  heading: 'My Queue',
  heroImage: '/assets/img1.jpg',
  focusCards: [
    { label: 'Terkendala', value: '1 unit', chip: 'Perlu keputusan', tone: tone.danger, href: '/services' },
    { label: 'Proses Servis', value: '3 unit', chip: 'Sedang dikerjakan', tone: tone.warning, href: '/services' },
    { label: 'Siap Test Drive', value: '1 unit', chip: 'QC berikutnya', tone: tone.info, href: '/services' },
    { label: 'Selesai Hari Ini', value: '2 unit', chip: 'Shift pagi', tone: tone.success, href: '/mechanic/tasks' },
  ],
  kpis: [
    { label: 'Task Aktif', value: '4', chip: 'Live', tone: tone.warning, href: '/mechanic/tasks' },
    { label: 'Selesai', value: '2', chip: 'Hari ini', tone: tone.success, href: '/services' },
    { label: 'Test Drive', value: '1', chip: 'QC', tone: tone.info, href: '/services' },
    { label: 'Terkendala', value: '1', chip: 'Watch', tone: tone.danger, href: '/services' },
  ],
  statusCounts: { ANTRIAN: 1, DIKERJAKAN: 3, TEST_DRIVE: 1, SELESAI: 2, DIAMBIL: 0, TERKENDALA: 1 },
  timeline: [
    { time: '11:24', text: 'WO-240603 berpindah ke test drive', status: 'TEST_DRIVE' },
    { time: '10:52', text: 'WO-240612 mulai dikerjakan', status: 'DIKERJAKAN' },
    { time: '10:31', text: 'WO-240609 menunggu keputusan', status: 'TERKENDALA' },
    { time: '09:50', text: 'WO-240608 selesai servis', status: 'SELESAI' },
  ],
  activeList: [
    { wo: 'WO-240612', plate: 'AB 7782 HL', model: 'J7', status: 'DIKERJAKAN', time: '10:52' },
    { wo: 'WO-240603', plate: 'AB 9901 QA', model: 'J7', status: 'TEST_DRIVE', time: '10:15' },
    { wo: 'WO-240609', plate: 'AB 5501 TR', model: 'J8', status: 'TERKENDALA', time: '10:31' },
    { wo: 'WO-240608', plate: 'AB 7743 PL', model: 'J7', status: 'SELESAI', time: '09:50' },
  ],
  priorityList: [
    { title: 'Unit tertahan', status: 'TERKENDALA', note: 'Menunggu konfirmasi sparepart', href: '/services' },
    { title: 'Unit menuju QC', status: 'TEST_DRIVE', note: 'Satu unit siap test drive final', href: '/services' },
    { title: 'Pekerjaan aktif', status: 'DIKERJAKAN', note: 'Fokus pada 3 unit proses servis', href: '/mechanic/tasks' },
  ],
};

export const dashboardOrderedStatuses: ServiceStatus[] = ['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA'];

export function getDashboardConfigByRole(role: Role | undefined): DashboardConfig {
  if (role === 'MANAGER') return managerConfig;
  if (role === 'FRONTLINE') return frontlineConfig;
  if (role === 'MEKANIK') return mechanicConfig;
  return adminConfig;
}

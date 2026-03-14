import { useMemo, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '../components/dashboard-shell';
import DataTable, { type TableColumn } from '../components/data-table';
import SectionCard from '../components/section-card';
import StatCard from '../components/stat-card';
import StatusBadge from '../components/status-badge';
import {
  adminSummary,
  attentionItems,
  customers,
  customerStats,
  masterServices,
  quickActions,
  recentUsers,
  reportStats,
  reports,
  serviceStats,
  settings,
  settingsStats,
  userStats,
  vehicleStats,
  vehicles,
  workOrders,
  workOrderStats,
  type CustomerItem,
  type MasterServiceItem,
  type ReportItem,
  type SettingItem,
  type UserActivityItem,
  type VehicleItem,
  type WorkOrderItem,
} from '../data/admin-dashboard-data';

type NoteItem = {
  title: string;
  description: string;
  tone?: 'default' | 'warning' | 'danger';
};

type SectionDefinition = {
  title: string;
  subtitle: string;
  stats: typeof adminSummary;
  content: ReactNode;
};

const workOrderColumns: TableColumn<WorkOrderItem>[] = [
  {
    key: 'id',
    header: 'Work Order',
    render: (row) => (
      <div>
        <strong>{row.id}</strong>
        <p className="dashboard-table__meta">{row.customer}</p>
      </div>
    ),
  },
  {
    key: 'vehicle',
    header: 'Kendaraan',
    render: (row) => row.vehicle,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'eta',
    header: 'Keterangan',
    render: (row) => row.eta,
  },
];

const userColumns: TableColumn<UserActivityItem>[] = [
  {
    key: 'name',
    header: 'Nama',
    render: (row) => (
      <div>
        <strong>{row.name}</strong>
        <p className="dashboard-table__meta">{row.role}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'updatedAt',
    header: 'Update Terakhir',
    render: (row) => row.updatedAt,
  },
];

const masterServiceColumns: TableColumn<MasterServiceItem>[] = [
  {
    key: 'name',
    header: 'Jenis Servis',
    render: (row) => (
      <div>
        <strong>{row.name}</strong>
        <p className="dashboard-table__meta">{row.category}</p>
      </div>
    ),
  },
  {
    key: 'duration',
    header: 'Durasi',
    render: (row) => row.duration,
  },
];

const customerColumns: TableColumn<CustomerItem>[] = [
  {
    key: 'name',
    header: 'Pemilik',
    render: (row) => (
      <div>
        <strong>{row.name}</strong>
        <p className="dashboard-table__meta">{row.city}</p>
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Kontak',
    render: (row) => row.phone,
  },
  {
    key: 'vehicles',
    header: 'Unit',
    render: (row) => row.vehicles,
  },
];

const vehicleColumns: TableColumn<VehicleItem>[] = [
  {
    key: 'plateNumber',
    header: 'Kendaraan',
    render: (row) => (
      <div>
        <strong>{row.plateNumber}</strong>
        <p className="dashboard-table__meta">{row.model}</p>
      </div>
    ),
  },
  {
    key: 'owner',
    header: 'Pemilik',
    render: (row) => row.owner,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const reportColumns: TableColumn<ReportItem>[] = [
  {
    key: 'title',
    header: 'Laporan',
    render: (row) => (
      <div>
        <strong>{row.title}</strong>
        <p className="dashboard-table__meta">{row.schedule}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const settingColumns: TableColumn<SettingItem>[] = [
  {
    key: 'module',
    header: 'Modul',
    render: (row) => (
      <div>
        <strong>{row.module}</strong>
        <p className="dashboard-table__meta">{row.value}</p>
      </div>
    ),
  },
];

function OverviewContent() {
  const operationalItems = [
    {
      title: 'User',
      to: '/dashboard/admin/users',
      detail: 'Kelola role dan approval akun operasional.',
    },
    {
      title: 'Pelanggan',
      to: '/dashboard/admin/customers',
      detail: 'Pastikan data pemilik rapi dan mudah dicari.',
    },
    {
      title: 'Kendaraan',
      to: '/dashboard/admin/vehicles',
      detail: 'Pantau unit aktif dan status servisnya.',
    },
    {
      title: 'Work Order',
      to: '/dashboard/admin/work-orders',
      detail: 'Lihat antrean, progres, dan kasus terkendala.',
    },
  ];

  return (
    <>
      <section className="dashboard-grid dashboard-grid--two-column">
        <SectionCard
          title="Ringkasan Operasional"
          subtitle="Empat area admin yang paling sering diakses setiap hari."
        >
          <div className="dashboard-attention-list">
            {operationalItems.map((item) => (
              <article key={item.title} className="dashboard-attention dashboard-attention--default">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <div style={{ marginTop: 12 }}>
                  <Link to={item.to} className="dashboard-inline-button">
                    Buka
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Perlu Perhatian"
          subtitle="Informasi penting dibuat singkat agar mudah dibaca semua usia."
        >
          <div className="dashboard-attention-list">
            {attentionItems.slice(0, 3).map((item) => (
              <article
                key={item.title}
                className={`dashboard-attention dashboard-attention--${item.tone}`}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="dashboard-grid dashboard-grid--two-column">
        <SectionCard
          title="Work Order Hari Ini"
          subtitle="Disederhanakan agar cepat dipindai tanpa terlalu banyak detail."
          action={
            <Link to="/dashboard/admin/work-orders" className="dashboard-inline-button">
              Lihat semua
            </Link>
          }
        >
          <DataTable columns={workOrderColumns} rows={workOrders.slice(0, 4)} />
        </SectionCard>

        <SectionCard
          title="Aksi Cepat"
          subtitle="Langkah singkat admin yang paling sering dilakukan."
        >
          <div className="dashboard-attention-list">
            {quickActions.slice(0, 4).map((item) => (
              <article key={item} className="dashboard-attention dashboard-attention--default">
                <h3>{item}</h3>
                <p>Siap dijadikan tombol aksi ketika backend sudah tersedia.</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>
    </>
  );
}

function SingleTablePage<T>({
  title,
  subtitle,
  action,
  columns,
  rows,
  notes,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  columns: TableColumn<T>[];
  rows: T[];
  notes: NoteItem[];
}) {
  return (
    <section className="dashboard-grid dashboard-grid--two-column">
      <SectionCard title={title} subtitle={subtitle} action={action}>
        <DataTable columns={columns} rows={rows} />
      </SectionCard>

      <SectionCard title="Catatan Admin" subtitle="Pesan dibuat ringkas dan mudah dipahami.">
        <div className="dashboard-attention-list">
          {notes.map((item) => (
            <article
              key={item.title}
              className={`dashboard-attention dashboard-attention--${item.tone ?? 'default'}`}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </section>
  );
}

export default function AdminDashboardPage() {
  const { section } = useParams<{ section?: string }>();

  const page = useMemo<SectionDefinition>(() => {
    switch (section) {
      case 'users':
        return {
          title: 'Manajemen User',
          subtitle: 'Halaman dibuat sederhana agar status akun mudah dibaca.',
          stats: userStats,
          content: (
            <SingleTablePage
              title="Daftar User"
              subtitle="Admin, manager service, front desk, dan mekanik."
              action={<button className="dashboard-inline-button">Tambah user</button>}
              columns={userColumns}
              rows={recentUsers}
              notes={[
                {
                  title: 'Role jelas',
                  description: 'Setiap akun sebaiknya hanya memegang akses yang dibutuhkan.',
                },
                {
                  title: 'Approval cepat',
                  description:
                    'Akun baru lebih nyaman dipantau bila statusnya singkat: aktif, pending, nonaktif.',
                },
                {
                  title: 'Update terakhir',
                  description:
                    'Waktu update membantu admin membaca aktivitas tanpa membuka detail panjang.',
                },
              ]}
            />
          ),
        };

      case 'services':
        return {
          title: 'Master Jenis Servis',
          subtitle: 'Informasi inti disusun sederhana namun tetap formal.',
          stats: serviceStats,
          content: (
            <SingleTablePage
              title="Master Servis"
              subtitle="Jenis servis utama yang sering dipakai oleh front desk dan workshop."
              action={<button className="dashboard-inline-button">Tambah master</button>}
              columns={masterServiceColumns}
              rows={masterServices}
              notes={[
                {
                  title: 'Nama mudah dikenali',
                  description: 'Gunakan nama servis yang familiar bagi semua pengguna sistem.',
                },
                {
                  title: 'Kategori singkat',
                  description:
                    'Periodic, inspection, repair, dan software sudah cukup jelas untuk tahap awal.',
                },
                {
                  title: 'Durasi realistis',
                  description:
                    'Durasi standar membantu pembagian pekerjaan dan ekspektasi customer.',
                },
              ]}
            />
          ),
        };

      case 'customers':
        return {
          title: 'Data Pelanggan',
          subtitle: 'Data pemilik kendaraan ditampilkan sederhana dan mudah dicari.',
          stats: customerStats,
          content: (
            <SingleTablePage
              title="Daftar Pemilik"
              subtitle="Fokus pada nama, kontak, domisili, dan jumlah unit."
              action={<button className="dashboard-inline-button">Tambah pemilik</button>}
              columns={customerColumns}
              rows={customers}
              notes={[
                {
                  title: 'Kontak aktif',
                  description:
                    'Nomor telepon yang benar mempermudah konfirmasi servis dan pengambilan unit.',
                },
                {
                  title: 'Data rapi',
                  description: 'Nama dan domisili yang jelas mengurangi duplikasi customer.',
                },
                {
                  title: 'Jumlah unit',
                  description:
                    'Informasi ini membantu melihat customer dengan lebih dari satu kendaraan.',
                },
              ]}
            />
          ),
        };

      case 'vehicles':
        return {
          title: 'Data Kendaraan',
          subtitle: 'Monitoring unit dibuat lebih tenang dan tidak terlalu padat.',
          stats: vehicleStats,
          content: (
            <SingleTablePage
              title="Daftar Kendaraan"
              subtitle="Plat, model, pemilik, dan status servis aktif."
              action={<button className="dashboard-inline-button">Tambah kendaraan</button>}
              columns={vehicleColumns}
              rows={vehicles}
              notes={[
                {
                  title: 'Plat nomor utama',
                  description: 'Sebagian besar pencarian unit dimulai dari plat nomor.',
                },
                {
                  title: 'Status singkat',
                  description: 'Badge status membantu pembacaan cepat bahkan di layar kecil.',
                },
                {
                  title: 'Relasi pemilik',
                  description:
                    'Kendaraan selalu lebih mudah ditelusuri bila pemilik tampil jelas.',
                },
              ]}
            />
          ),
        };

      case 'work-orders':
        return {
          title: 'Work Order',
          subtitle: 'Halaman inti admin dibuat lebih ringan dan fokus pada progres kerja.',
          stats: workOrderStats,
          content: (
            <SingleTablePage
              title="Daftar Work Order"
              subtitle="Nomor WO, kendaraan, status, dan keterangan utama."
              action={<button className="dashboard-inline-button">Buat WO</button>}
              columns={workOrderColumns}
              rows={workOrders}
              notes={[
                {
                  title: 'Antrian',
                  description: 'Unit sudah diterima dan menunggu pengerjaan.',
                },
                {
                  title: 'Proses / test drive',
                  description:
                    'Status antara membantu admin melihat posisi unit secara cepat.',
                },
                {
                  title: 'Terkendala',
                  description:
                    'Kasus ini perlu perhatian lebih dulu daripada membaca semua detail teknis.',
                  tone: 'danger',
                },
              ]}
            />
          ),
        };

      case 'reports':
        return {
          title: 'Laporan',
          subtitle: 'Tampilan laporan dibuat sederhana agar mudah dipahami semua pengguna.',
          stats: reportStats,
          content: (
            <SingleTablePage
              title="Template Laporan"
              subtitle="Laporan operasional yang siap dipantau atau diekspor."
              action={<button className="dashboard-inline-button">Ekspor</button>}
              columns={reportColumns}
              rows={reports}
              notes={[
                {
                  title: 'Laporan harian',
                  description: 'Dipakai untuk menutup aktivitas operasional harian.',
                },
                {
                  title: 'Laporan mingguan',
                  description:
                    'Membantu manager membaca tren tanpa membuka detail satu per satu.',
                },
                {
                  title: 'Status distribusi',
                  description:
                    'Cukup tampil aktif, pending, atau nonaktif agar tetap sederhana.',
                },
              ]}
            />
          ),
        };

      case 'settings':
        return {
          title: 'Pengaturan',
          subtitle: 'Konfigurasi penting disajikan lebih ringkas agar tidak membingungkan.',
          stats: settingsStats,
          content: (
            <SingleTablePage
              title="Konfigurasi Inti"
              subtitle="Hal utama yang memengaruhi alur dashboard admin."
              action={<button className="dashboard-inline-button">Simpan</button>}
              columns={settingColumns}
              rows={settings}
              notes={[
                {
                  title: 'Permission per role',
                  description:
                    'Dasar untuk dashboard manager, mekanik, dan front desk berikutnya.',
                },
                {
                  title: 'Approval & notifikasi',
                  description:
                    'Buat alur persetujuan sesingkat mungkin agar mudah dipahami.',
                },
                {
                  title: 'Audit sederhana',
                  description: 'Setiap perubahan penting tetap perlu jejak yang jelas.',
                },
              ]}
            />
          ),
        };

      default:
        return {
          title: 'Admin Dashboard',
          subtitle:
            'Ringkas, tenang, dan tetap selaras dengan identitas visual sistem JAECOO Anda.',
          stats: adminSummary,
          content: <OverviewContent />,
        };
    }
  }, [section]);

  return (
    <DashboardShell title={page.title} subtitle={page.subtitle}>
      <section className="dashboard-grid dashboard-grid--stats">
        {page.stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      {page.content}
    </DashboardShell>
  );
}
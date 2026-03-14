import { useMemo, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '../../dashboard/components/dashboard-shell';
import DataTable, { type TableColumn } from '../../dashboard/components/data-table';
import SectionCard from '../../dashboard/components/section-card';
import StatCard from '../../dashboard/components/stat-card';
import StatusBadge from '../../dashboard/components/status-badge';
import {
  jobStats,
  mechanicJobs,
  mechanicMenus,
  mechanicSummary,
  mechanicTimeline,
  partRequests,
  partStats,
  qualityChecks,
  qualityStats,
  type MechanicJobItem,
  type MechanicTimelineItem,
  type PartRequestItem,
  type QualityCheckItem,
} from '../../dashboard/data/mechanic-dashboard-data';
import type { AdminSummaryItem } from '../../dashboard/data/admin-dashboard-data';

type NoteTone = 'default' | 'warning' | 'danger';

type SectionDefinition = {
  title: string;
  subtitle: string;
  stats: AdminSummaryItem[];
  content: ReactNode;
};

const jobColumns: TableColumn<MechanicJobItem>[] = [
  {
    key: 'id',
    header: 'Work Order',
    render: (row) => (
      <div>
        <strong>{row.id}</strong>
        <p className="dashboard-table__meta">{row.vehicle}</p>
      </div>
    ),
  },
  {
    key: 'complaint',
    header: 'Keluhan',
    render: (row) => row.complaint,
  },
  {
    key: 'currentTask',
    header: 'Pekerjaan Saat Ini',
    render: (row) => row.currentTask,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'target',
    header: 'Target',
    render: (row) => row.target,
  },
];

const partColumns: TableColumn<PartRequestItem>[] = [
  {
    key: 'code',
    header: 'Request',
    render: (row) => (
      <div>
        <strong>{row.code}</strong>
        <p className="dashboard-table__meta">{row.vehicle}</p>
      </div>
    ),
  },
  {
    key: 'part',
    header: 'Part',
    render: (row) => row.part,
  },
  {
    key: 'qty',
    header: 'Qty',
    render: (row) => row.qty,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const qualityColumns: TableColumn<QualityCheckItem>[] = [
  {
    key: 'checkpoint',
    header: 'Checkpoint',
    render: (row) => (
      <div>
        <strong>{row.checkpoint}</strong>
        <p className="dashboard-table__meta">{row.detail}</p>
      </div>
    ),
  },
  {
    key: 'result',
    header: 'Hasil',
    render: (row) => row.result,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

function TimelinePanel({
  title,
  subtitle,
  items,
  action,
}: {
  title: string;
  subtitle: string;
  items: MechanicTimelineItem[];
  action?: ReactNode;
}) {
  return (
    <SectionCard title={title} subtitle={subtitle} action={action}>
      <div className="dashboard-attention-list">
        {items.map((item) => (
          <article
            key={`${item.time}-${item.title}`}
            className={`dashboard-attention dashboard-attention--${item.tone ?? 'default'}`}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p className="dashboard-table__meta" style={{ marginTop: 10 }}>
              {item.time}
            </p>
          </article>
        ))}
      </div>
    </SectionCard>
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
  notes: { title: string; description: string; tone?: NoteTone }[];
}) {
  return (
    <section className="dashboard-grid dashboard-grid--two-column">
      <SectionCard title={title} subtitle={subtitle} action={action}>
        <DataTable columns={columns} rows={rows} />
      </SectionCard>

      <SectionCard title="Catatan Mekanik" subtitle="Panel singkat untuk fokus kerja hari ini.">
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

function OverviewContent() {
  const quickActions = [
    {
      title: 'Tugas Aktif',
      to: '/dashboard/mechanic/jobs',
      detail: 'Lihat daftar unit yang sedang saya tangani hari ini.',
    },
    {
      title: 'Timeline Kerja',
      to: '/dashboard/mechanic/timeline',
      detail: 'Catat progres dari awal inspeksi sampai siap final check.',
    },
    {
      title: 'Permintaan Part',
      to: '/dashboard/mechanic/parts',
      detail: 'Pantau part request agar pekerjaan tidak terhenti terlalu lama.',
    },
    {
      title: 'Final Check',
      to: '/dashboard/mechanic/final-check',
      detail: 'Cek ulang pekerjaan sebelum unit pindah ke QC atau front desk.',
    },
  ];

  return (
    <>
      <section className="dashboard-grid dashboard-grid--two-column">
        <SectionCard
          title="Fokus Hari Ini"
          subtitle="Empat area utama yang membantu mekanik tetap rapi dan konsisten."
        >
          <div className="dashboard-attention-list">
            {quickActions.map((item) => (
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

        <TimelinePanel
          title="Alur Kerja Hari Ini"
          subtitle="Pengingat singkat untuk progres yang sudah dan akan dilakukan."
          items={mechanicTimeline}
        />
      </section>

      <section className="dashboard-grid dashboard-grid--two-column">
        <SectionCard
          title="Job Aktif"
          subtitle="Ringkasan unit yang paling perlu saya perhatikan sekarang."
          action={
            <Link to="/dashboard/mechanic/jobs" className="dashboard-inline-button">
              Lihat semua
            </Link>
          }
        >
          <DataTable columns={jobColumns} rows={mechanicJobs.slice(0, 3)} />
        </SectionCard>

        <SectionCard
          title="Permintaan Part"
          subtitle="Part penting yang memengaruhi kelancaran pekerjaan hari ini."
          action={
            <Link to="/dashboard/mechanic/parts" className="dashboard-inline-button">
              Buka part
            </Link>
          }
        >
          <DataTable columns={partColumns} rows={partRequests.slice(0, 3)} />
        </SectionCard>
      </section>
    </>
  );
}

export default function MechanicDashboardPage() {
  const { section } = useParams<{ section?: string }>();

  const page = useMemo<SectionDefinition>(() => {
    switch (section) {
      case 'jobs':
        return {
          title: 'Tugas Aktif',
          subtitle: 'Daftar pekerjaan dibuat jelas agar mekanik mudah fokus dan tidak kehilangan urutan kerja.',
          stats: jobStats,
          content: (
            <SingleTablePage
              title="Daftar Job"
              subtitle="Keluhan, tugas saat ini, status, dan target penyelesaian."
              action={<button className="dashboard-inline-button">Update progres</button>}
              columns={jobColumns}
              rows={mechanicJobs}
              notes={[
                {
                  title: 'Kerjakan sesuai urutan prioritas',
                  description: 'Utamakan unit yang stall-nya sudah terpakai dan approval-nya lengkap.',
                },
                {
                  title: 'Progress singkat lebih berguna',
                  description: 'Catatan pendek namun rutin memudahkan manager dan front desk memahami kondisi unit.',
                },
                {
                  title: 'Kasus terkendala jangan dibiarkan diam',
                  description: 'Segera tandai blocker supaya parts counter atau manager bisa ikut bantu.',
                  tone: 'danger',
                },
              ]}
            />
          ),
        };
      case 'timeline':
        return {
          title: 'Timeline Kerja',
          subtitle: 'Area ini membantu mekanik melihat urutan kerja tanpa harus membaca tabel panjang.',
          stats: mechanicSummary,
          content: (
            <section className="dashboard-grid dashboard-grid--two-column">
              <TimelinePanel
                title="Urutan Aktivitas"
                subtitle="Catatan kerja dari awal shift hingga unit siap diserahkan."
                items={mechanicTimeline}
                action={<button className="dashboard-inline-button">Tambah catatan</button>}
              />
              <TimelinePanel
                title="Pengingat Penting"
                subtitle="Poin sederhana agar pekerjaan tetap konsisten dan aman."
                items={[
                  {
                    time: 'Info',
                    title: 'Foto kondisi awal bila perlu',
                    description: 'Dokumentasi singkat membantu jika ada pertanyaan saat serah terima.',
                    tone: 'default',
                  },
                  {
                    time: 'Info',
                    title: 'Jangan menunda update status',
                    description: 'Status kecil yang rutin lebih baik daripada update besar yang terlambat.',
                    tone: 'warning',
                  },
                  {
                    time: 'Info',
                    title: 'Tutup pekerjaan dengan checklist akhir',
                    description: 'Hindari unit keluar sebelum torque, fluid, dan kebersihan diperiksa ulang.',
                    tone: 'default',
                  },
                ]}
              />
            </section>
          ),
        };
      case 'parts':
        return {
          title: 'Permintaan Part',
          subtitle: 'Pantau request part agar pekerjaan tidak berhenti tanpa kejelasan.',
          stats: partStats,
          content: (
            <SingleTablePage
              title="Daftar Request Part"
              subtitle="Part yang sudah diajukan, menunggu, atau selesai diproses."
              action={<button className="dashboard-inline-button">Request baru</button>}
              columns={partColumns}
              rows={partRequests}
              notes={[
                {
                  title: 'Pisahkan part urgent dan part normal',
                  description: 'Ini membantu counter membaca kebutuhan Anda lebih cepat.',
                },
                {
                  title: 'Cantumkan unit dengan jelas',
                  description: 'Nomor polisi dan work order yang benar mengurangi kesalahan ambil part.',
                },
                {
                  title: 'Follow-up request pending',
                  description: 'Satu part pending sering membuat satu stall ikut tertahan.',
                  tone: 'warning',
                },
              ]}
            />
          ),
        };
      case 'final-check':
        return {
          title: 'Final Check',
          subtitle: 'Checklist akhir dibuat sederhana agar mudah dilakukan sebelum unit keluar dari stall.',
          stats: qualityStats,
          content: (
            <SingleTablePage
              title="Checklist Final"
              subtitle="Poin penting sebelum unit pindah ke QC lane atau front desk."
              action={<button className="dashboard-inline-button">Tandai selesai</button>}
              columns={qualityColumns}
              rows={qualityChecks}
              notes={[
                {
                  title: 'Periksa hasil pekerjaan sendiri sekali lagi',
                  description: 'Langkah ini sederhana tetapi paling efektif mencegah rework kecil.',
                },
                {
                  title: 'Pastikan catatan test drive jelas',
                  description: 'Jika belum diuji, beri status yang jujur agar QC dan manager bisa mengatur slot.',
                },
                {
                  title: 'Kebersihan juga bagian dari kualitas',
                  description: 'Unit yang bersih memberi kesan pekerjaan selesai dengan rapi dan profesional.',
                  tone: 'default',
                },
              ]}
            />
          ),
        };
      default:
        return {
          title: 'Mechanic Dashboard',
          subtitle: 'Fokus pada tugas aktif, part request, dan final check tanpa mengubah identitas visual yang sudah ada.',
          stats: mechanicSummary,
          content: <OverviewContent />,
        };
    }
  }, [section]);

  return (
    <DashboardShell
      title={page.title}
      subtitle={page.subtitle}
      menus={mechanicMenus}
      roleLabel="Mechanic Console"
      footerText="Prototype internal JAECOO Service Management System untuk aktivitas teknisi workshop."
      breadcrumb="Dashboard / Mechanic"
      searchPlaceholder="Cari work order, part, atau checkpoint..."
      topbarActions={
        <>
          <button type="button" className="dashboard-topbar__button dashboard-topbar__button--ghost">
            Lihat Antrian
          </button>
          <button type="button" className="dashboard-topbar__button">
            Update Progres
          </button>
        </>
      }
    >
      <section className="dashboard-grid dashboard-grid--stats">
        {page.stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>
      {page.content}
    </DashboardShell>
  );
}

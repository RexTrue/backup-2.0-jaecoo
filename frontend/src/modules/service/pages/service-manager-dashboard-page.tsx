import { useMemo, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '../../dashboard/components/dashboard-shell';
import DataTable, { type TableColumn } from '../../dashboard/components/data-table';
import SectionCard from '../../dashboard/components/section-card';
import StatCard from '../../dashboard/components/stat-card';
import StatusBadge from '../../dashboard/components/status-badge';
import {
  approvals,
  approvalStats,
  blockers,
  managerAttention,
  managerMenus,
  managerQueue,
  managerSummary,
  qualityGates,
  qualityStats,
  queueStats,
  reportStats,
  shiftReports,
  technicianLoad,
  technicianStats,
  type ApprovalItem,
  type BlockerItem,
  type ManagerQueueItem,
  type QualityGateItem,
  type TechnicianLoadItem,
  type TimelineItem,
} from '../../dashboard/data/service-manager-dashboard-data';
import type { AdminSummaryItem } from '../../dashboard/data/admin-dashboard-data';

type NoteTone = 'default' | 'warning' | 'danger';

type SectionDefinition = {
  title: string;
  subtitle: string;
  stats: AdminSummaryItem[];
  content: ReactNode;
};

const queueColumns: TableColumn<ManagerQueueItem>[] = [
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
    key: 'stall',
    header: 'Posisi',
    render: (row) => row.stall,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'eta',
    header: 'Target',
    render: (row) => row.eta,
  },
];

const technicianColumns: TableColumn<TechnicianLoadItem>[] = [
  {
    key: 'name',
    header: 'Mekanik',
    render: (row) => (
      <div>
        <strong>{row.name}</strong>
        <p className="dashboard-table__meta">{row.specialty}</p>
      </div>
    ),
  },
  {
    key: 'activeJobs',
    header: 'Beban Aktif',
    render: (row) => row.activeJobs,
  },
  {
    key: 'utilization',
    header: 'Utilisasi',
    render: (row) => row.utilization,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const approvalColumns: TableColumn<ApprovalItem>[] = [
  {
    key: 'code',
    header: 'Approval',
    render: (row) => (
      <div>
        <strong>{row.code}</strong>
        <p className="dashboard-table__meta">{row.subject}</p>
      </div>
    ),
  },
  {
    key: 'owner',
    header: 'Pemilik Kasus',
    render: (row) => row.owner,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'note',
    header: 'Catatan',
    render: (row) => row.note,
  },
];

const blockerColumns: TableColumn<BlockerItem>[] = [
  {
    key: 'code',
    header: 'Kode',
    render: (row) => (
      <div>
        <strong>{row.code}</strong>
        <p className="dashboard-table__meta">{row.vehicle}</p>
      </div>
    ),
  },
  {
    key: 'blocker',
    header: 'Kendala',
    render: (row) => row.blocker,
  },
  {
    key: 'owner',
    header: 'PIC',
    render: (row) => row.owner,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const qualityColumns: TableColumn<QualityGateItem>[] = [
  {
    key: 'checkpoint',
    header: 'Checkpoint',
    render: (row) => row.checkpoint,
  },
  {
    key: 'target',
    header: 'Target',
    render: (row) => row.target,
  },
  {
    key: 'actual',
    header: 'Aktual',
    render: (row) => row.actual,
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
  items: TimelineItem[];
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

      <SectionCard title="Catatan Manager" subtitle="Informasi utama untuk pengambilan keputusan shift ini.">
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
  const quickLinks = [
    {
      title: 'Kontrol Antrian',
      to: '/dashboard/service-manager/queue',
      detail: 'Baca posisi unit, stall, dan target penyelesaian dalam satu tampilan.',
    },
    {
      title: 'Beban Mekanik',
      to: '/dashboard/service-manager/technicians',
      detail: 'Pastikan distribusi pekerjaan tetap seimbang dan tidak menumpuk di satu teknisi.',
    },
    {
      title: 'Persetujuan',
      to: '/dashboard/service-manager/approvals',
      detail: 'Follow-up approval customer, overtime, dan kebutuhan tambahan part.',
    },
    {
      title: 'Quality Gate',
      to: '/dashboard/service-manager/quality',
      detail: 'Pantau first time fix, on time delivery, dan final check workshop.',
    },
  ];

  return (
    <>
      <section className="dashboard-grid dashboard-grid--two-column">
        <SectionCard
          title="Kontrol Shift Hari Ini"
          subtitle="Area yang paling sering dipakai manager service untuk menjaga ritme workshop."
        >
          <div className="dashboard-attention-list">
            {quickLinks.map((item) => (
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
          title="Perlu Tindakan Cepat"
          subtitle="Catatan yang sebaiknya dibaca sebelum briefing berikutnya."
          items={managerAttention}
        />
      </section>

      <section className="dashboard-grid dashboard-grid--two-column">
        <SectionCard
          title="Antrian Aktif"
          subtitle="Ringkasan work order yang paling perlu dipantau manager service."
          action={
            <Link to="/dashboard/service-manager/queue" className="dashboard-inline-button">
              Lihat antrian
            </Link>
          }
        >
          <DataTable columns={queueColumns} rows={managerQueue.slice(0, 4)} />
        </SectionCard>

        <TimelinePanel
          title="Laporan Shift"
          subtitle="Ringkasan pendek untuk handover dan evaluasi operasional."
          items={shiftReports}
          action={
            <Link to="/dashboard/service-manager/reports" className="dashboard-inline-button">
              Buka laporan
            </Link>
          }
        />
      </section>
    </>
  );
}

export default function ServiceManagerDashboardPage() {
  const { section } = useParams<{ section?: string }>();

  const page = useMemo<SectionDefinition>(() => {
    switch (section) {
      case 'queue':
        return {
          title: 'Kontrol Antrian',
          subtitle: 'Manager service memantau alur unit dari pre-check hingga siap serah.',
          stats: queueStats,
          content: (
            <SingleTablePage
              title="Monitoring Work Order"
              subtitle="Unit aktif, posisi stall, dan target penyelesaian shift ini."
              action={<button className="dashboard-inline-button">Atur prioritas</button>}
              columns={queueColumns}
              rows={managerQueue}
              notes={[
                {
                  title: 'Dahulukan unit dengan approval sudah lengkap',
                  description: 'Ini membantu stall bergerak tanpa menunggu keputusan tambahan dari customer.',
                },
                {
                  title: 'Jaga hybrid bay tetap longgar',
                  description: 'Unit SHS sebaiknya tidak menumpuk agar teknisi spesialis tetap fokus.',
                  tone: 'warning',
                },
                {
                  title: 'Case terkendala butuh owner yang jelas',
                  description: 'Setiap hambatan sebaiknya punya PIC agar follow-up tidak berhenti di tengah hari.',
                  tone: 'danger',
                },
              ]}
            />
          ),
        };
      case 'technicians':
        return {
          title: 'Beban Mekanik',
          subtitle: 'Distribusi pekerjaan dibuat sederhana agar keputusan alokasi lebih cepat.',
          stats: technicianStats,
          content: (
            <SingleTablePage
              title="Distribusi Tim Workshop"
              subtitle="Pantau spesialisasi, beban aktif, dan utilisasi mekanik."
              action={<button className="dashboard-inline-button">Susun ulang beban</button>}
              columns={technicianColumns}
              rows={technicianLoad}
              notes={[
                {
                  title: 'Jangan biarkan 1 teknisi menahan terlalu banyak quick job',
                  description: 'Pembagian seimbang membuat waktu tunggu customer lebih stabil.',
                },
                {
                  title: 'QC perlu slot bersih',
                  description: 'Saat final check menumpuk, delivery juga ikut melambat.',
                },
                {
                  title: 'Utilisasi tinggi harus disertai kontrol kualitas',
                  description: 'Produktivitas bagus, tetapi rework kecil bisa merusak ritme seluruh shift.',
                  tone: 'warning',
                },
              ]}
            />
          ),
        };
      case 'approvals':
        return {
          title: 'Persetujuan',
          subtitle: 'Semua approval penting diringkas agar manager dapat mengambil keputusan cepat.',
          stats: approvalStats,
          content: (
            <SingleTablePage
              title="Daftar Approval"
              subtitle="Customer approval, overtime, dan kebutuhan part tambahan."
              action={<button className="dashboard-inline-button">Hubungi customer</button>}
              columns={approvalColumns}
              rows={approvals}
              notes={[
                {
                  title: 'Approval customer berdampak langsung ke flow stall',
                  description: 'Kasus yang lama menunggu akan mengganggu unit di belakangnya.',
                },
                {
                  title: 'Keputusan lembur harus tetap selektif',
                  description: 'Pastikan lembur hanya untuk unit yang memang memberi nilai tambah operasional.',
                },
                {
                  title: 'Part alternatif perlu catatan yang rapi',
                  description: 'Agar saat handover, tim berikutnya tetap memahami keputusan yang sudah diambil.',
                  tone: 'warning',
                },
              ]}
            />
          ),
        };
      case 'quality':
        return {
          title: 'Quality Gate',
          subtitle: 'Checkpoint mutu dibuat singkat agar mudah dibaca sambil memantau workshop.',
          stats: qualityStats,
          content: (
            <SingleTablePage
              title="Checkpoint Kualitas"
              subtitle="Target mutu harian yang membantu menjaga first time fix dan delivery."
              action={<button className="dashboard-inline-button">Review QC</button>}
              columns={qualityColumns}
              rows={qualityGates}
              notes={[
                {
                  title: 'First time fix tetap prioritas utama',
                  description: 'Angka ini paling memengaruhi kepercayaan customer dan efisiensi stall.',
                },
                {
                  title: 'On time delivery harus dijaga bersama front desk',
                  description: 'Keterlambatan kecil di workshop sering terasa besar di area customer.',
                },
                {
                  title: 'Repeat finding wajib ditutup tuntas',
                  description: 'Jangan biarkan unit keluar sebelum penyebab utamanya dipastikan aman.',
                  tone: 'danger',
                },
              ]}
            />
          ),
        };
      case 'blockers':
        return {
          title: 'Kendala & Eskalasi',
          subtitle: 'Kasus yang menghambat flow kerja dikumpulkan dalam satu halaman ringkas.',
          stats: managerSummary,
          content: (
            <SingleTablePage
              title="Daftar Kendala Aktif"
              subtitle="Part, approval, dan bottleneck operasional yang perlu diurai."
              action={<button className="dashboard-inline-button">Eskalasi</button>}
              columns={blockerColumns}
              rows={blockers}
              notes={[
                {
                  title: 'Tentukan PIC untuk setiap blocker',
                  description: 'Kendala paling sering lambat selesai karena tidak jelas siapa yang menindaklanjuti.',
                },
                {
                  title: 'Pisahkan kendala part dan approval',
                  description: 'Dua jenis hambatan ini punya ritme follow-up yang berbeda.',
                },
                {
                  title: 'Eskalasi jangan menunggu akhir hari',
                  description: 'Kasus penting sebaiknya diangkat sebelum stall kehilangan momentum kerja.',
                  tone: 'danger',
                },
              ]}
            />
          ),
        };
      case 'reports':
        return {
          title: 'Laporan Shift',
          subtitle: 'Ringkasan shift dirancang sederhana untuk handover dan evaluasi harian.',
          stats: reportStats,
          content: (
            <section className="dashboard-grid dashboard-grid--two-column">
              <TimelinePanel
                title="Catatan Shift"
                subtitle="Poin singkat yang siap dipakai untuk briefing atau handover."
                items={shiftReports}
                action={<button className="dashboard-inline-button">Ekspor ringkasan</button>}
              />
              <TimelinePanel
                title="Perhatian Manager"
                subtitle="Topik yang perlu diteruskan ke front desk atau admin service."
                items={managerAttention}
              />
            </section>
          ),
        };
      default:
        return {
          title: 'Manager Service Dashboard',
          subtitle: 'Fokus pada ritme workshop, kualitas pengerjaan, dan keputusan shift yang cepat.',
          stats: managerSummary,
          content: <OverviewContent />,
        };
    }
  }, [section]);

  return (
    <DashboardShell
      title={page.title}
      subtitle={page.subtitle}
      menus={managerMenus}
      roleLabel="Manager Service"
      footerText="Prototype internal JAECOO Service Management System untuk kontrol workshop."
      breadcrumb="Dashboard / Manager Service"
      searchPlaceholder="Cari work order, mekanik, stall, atau approval..."
      topbarActions={
        <>
          <button type="button" className="dashboard-topbar__button dashboard-topbar__button--ghost">
            Ekspor Shift
          </button>
          <button type="button" className="dashboard-topbar__button">
            Briefing Notes
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

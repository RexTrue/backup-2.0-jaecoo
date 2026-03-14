import { useMemo, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '../../dashboard/components/dashboard-shell';
import DataTable, { type TableColumn } from '../../dashboard/components/data-table';
import SectionCard from '../../dashboard/components/section-card';
import StatCard from '../../dashboard/components/stat-card';
import StatusBadge from '../../dashboard/components/status-badge';
import {
  approvalStats,
  bookingStats,
  deliveryStats,
  followUpStats,
  frontDeskApprovals,
  frontDeskBookings,
  frontDeskDeliveries,
  frontDeskFollowUps,
  frontDeskMenus,
  frontDeskReception,
  frontDeskSummary,
  frontDeskTimeline,
  receptionStats,
  type FrontDeskApprovalItem,
  type FrontDeskBookingItem,
  type FrontDeskDeliveryItem,
  type FrontDeskFollowUpItem,
  type FrontDeskReceptionItem,
  type FrontDeskTimelineItem,
} from '../../dashboard/data/front-desk-dashboard-data';
import type { AdminSummaryItem } from '../../dashboard/data/admin-dashboard-data';

type NoteTone = 'default' | 'warning' | 'danger';

type SectionDefinition = {
  title: string;
  subtitle: string;
  stats: AdminSummaryItem[];
  content: ReactNode;
};

const receptionColumns: TableColumn<FrontDeskReceptionItem>[] = [
  {
    key: 'code',
    header: 'Penerimaan',
    render: (row) => (
      <div>
        <strong>{row.code}</strong>
        <p className="dashboard-table__meta">{row.customer}</p>
      </div>
    ),
  },
  { key: 'vehicle', header: 'Kendaraan', render: (row) => row.vehicle },
  { key: 'appointment', header: 'Janji Datang', render: (row) => row.appointment },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

const bookingColumns: TableColumn<FrontDeskBookingItem>[] = [
  {
    key: 'slot',
    header: 'Slot',
    render: (row) => (
      <div>
        <strong>{row.slot}</strong>
        <p className="dashboard-table__meta">{row.customer}</p>
      </div>
    ),
  },
  { key: 'advisor', header: 'Service Advisor', render: (row) => row.advisor },
  { key: 'serviceType', header: 'Layanan', render: (row) => row.serviceType },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

const approvalColumns: TableColumn<FrontDeskApprovalItem>[] = [
  {
    key: 'code',
    header: 'Approval',
    render: (row) => (
      <div>
        <strong>{row.code}</strong>
        <p className="dashboard-table__meta">{row.customer}</p>
      </div>
    ),
  },
  { key: 'subject', header: 'Perihal', render: (row) => row.subject },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'note', header: 'Catatan', render: (row) => row.note },
];

const deliveryColumns: TableColumn<FrontDeskDeliveryItem>[] = [
  {
    key: 'workOrder',
    header: 'Work Order',
    render: (row) => (
      <div>
        <strong>{row.workOrder}</strong>
        <p className="dashboard-table__meta">{row.vehicle}</p>
      </div>
    ),
  },
  { key: 'readiness', header: 'Kesiapan', render: (row) => row.readiness },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

const followUpColumns: TableColumn<FrontDeskFollowUpItem>[] = [
  {
    key: 'customer',
    header: 'Customer',
    render: (row) => (
      <div>
        <strong>{row.customer}</strong>
        <p className="dashboard-table__meta">{row.channel}</p>
      </div>
    ),
  },
  { key: 'purpose', header: 'Tujuan', render: (row) => row.purpose },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

function TimelinePanel({
  title,
  subtitle,
  items,
  action,
}: {
  title: string;
  subtitle: string;
  items: FrontDeskTimelineItem[];
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

      <SectionCard title="Catatan Front Desk" subtitle="Panel ringkas untuk ritme pelayanan harian.">
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
      title: 'Penerimaan Unit',
      to: '/dashboard/front-desk/reception',
      detail: 'Pantau check-in, keluhan awal, dan status penerimaan kendaraan.',
    },
    {
      title: 'Jadwal & Booking',
      to: '/dashboard/front-desk/bookings',
      detail: 'Atur slot kedatangan agar antrian bengkel tetap terdistribusi rapi.',
    },
    {
      title: 'Persetujuan Customer',
      to: '/dashboard/front-desk/approvals',
      detail: 'Lacak persetujuan pekerjaan tambahan dan update komunikasi customer.',
    },
    {
      title: 'Serah Terima',
      to: '/dashboard/front-desk/deliveries',
      detail: 'Pastikan unit siap dijelaskan dan diserahkan dengan tenang.',
    },
  ];

  return (
    <>
      <section className="dashboard-grid dashboard-grid--two-column">
        <SectionCard title="Alur Front Desk" subtitle="Empat area inti agar pelayanan tetap rapi dan mudah dibaca.">
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
          title="Ritme Hari Ini"
          subtitle="Supaya front desk cepat memahami apa yang harus diprioritaskan."
          items={frontDeskTimeline}
        />
      </section>

      <section className="dashboard-grid dashboard-grid--two-column">
        <SectionCard
          title="Check-in Terbaru"
          subtitle="Ringkas dan fokus pada kendaraan yang sedang ditangani."
          action={
            <Link to="/dashboard/front-desk/reception" className="dashboard-inline-button">
              Lihat semua
            </Link>
          }
        >
          <DataTable columns={receptionColumns} rows={frontDeskReception.slice(0, 4)} />
        </SectionCard>

        <SectionCard
          title="Follow-up Penting"
          subtitle="Daftar komunikasi yang perlu dituntaskan oleh front desk."
        >
          <div className="dashboard-attention-list">
            {[
              {
                title: 'Konfirmasi pickup sore ini',
                description: 'Hubungi customer yang unitnya sudah selesai namun belum menentukan waktu pengambilan.',
                tone: 'warning' as const,
              },
              {
                title: 'Approval pekerjaan tambahan',
                description: 'Pastikan kasus pending tidak lewat dari slot estimasi pengerjaan.',
                tone: 'danger' as const,
              },
              {
                title: 'Reminder booking besok pagi',
                description: 'Kirim pengingat agar kedatangan customer lebih teratur dan tidak menumpuk.',
                tone: 'default' as const,
              },
            ].map((item) => (
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
    </>
  );
}

export default function FrontDeskDashboardPage() {
  const { section } = useParams<{ section?: string }>();

  const page = useMemo<SectionDefinition>(() => {
    switch (section) {
      case 'reception':
        return {
          title: 'Penerimaan Unit',
          subtitle: 'Membantu front desk membaca check-in kendaraan dengan cepat.',
          stats: receptionStats,
          content: (
            <SingleTablePage
              title="Daftar Penerimaan"
              subtitle="Kode check-in, customer, kendaraan, dan status layanan awal."
              action={<button className="dashboard-inline-button">Check-in baru</button>}
              columns={receptionColumns}
              rows={frontDeskReception}
              notes={[
                { title: 'Keluhan awal jelas', description: 'Gunakan bahasa customer yang mudah dipahami sebelum diterjemahkan ke work order.' },
                { title: 'Estimasi singkat', description: 'Sampaikan target awal dengan tenang agar customer nyaman menunggu update berikutnya.' },
                { title: 'Kasus terkendala', description: 'Jika ada hambatan sejak awal, beri tanda dan komunikasikan lebih dulu.', tone: 'warning' },
              ]}
            />
          ),
        };
      case 'bookings':
        return {
          title: 'Jadwal & Booking',
          subtitle: 'Tampilan slot dibuat sederhana agar mudah dibaca lintas usia.',
          stats: bookingStats,
          content: (
            <SingleTablePage
              title="Slot Booking"
              subtitle="Waktu kedatangan, advisor, jenis layanan, dan status booking."
              action={<button className="dashboard-inline-button">Tambah booking</button>}
              columns={bookingColumns}
              rows={frontDeskBookings}
              notes={[
                { title: 'Pagi lebih padat', description: 'Sebagian besar customer memilih slot pagi, jadi buffer waktu perlu dijaga.' },
                { title: 'Quick service', description: 'Gunakan slot khusus agar layanan singkat tidak mengganggu antrian reguler.' },
                { title: 'Reschedule cepat', description: 'Perubahan jadwal sebaiknya langsung dihubungi kembali agar slot tidak kosong.', tone: 'warning' },
              ]}
            />
          ),
        };
      case 'approvals':
        return {
          title: 'Persetujuan Customer',
          subtitle: 'Fokus pada keputusan customer yang memengaruhi proses bengkel.',
          stats: approvalStats,
          content: (
            <SingleTablePage
              title="Approval Berjalan"
              subtitle="Kasus yang perlu dijelaskan, diingatkan, atau ditutup hari ini."
              action={<button className="dashboard-inline-button">Catat approval</button>}
              columns={approvalColumns}
              rows={frontDeskApprovals}
              notes={[
                { title: 'Bahasa sederhana', description: 'Gunakan penjelasan pekerjaan yang tidak terlalu teknis saat berbicara ke customer.' },
                { title: 'Catat kanal komunikasi', description: 'Simpan apakah approval datang dari telepon, WhatsApp, atau tatap muka.' },
                { title: 'Pending jangan lewat lama', description: 'Approval yang tertunda bisa menghambat stall dan target selesai.', tone: 'danger' },
              ]}
            />
          ),
        };
      case 'deliveries':
        return {
          title: 'Serah Terima',
          subtitle: 'Membantu front desk menyiapkan unit selesai dengan lebih teratur.',
          stats: deliveryStats,
          content: (
            <SingleTablePage
              title="Daftar Delivery"
              subtitle="Status kesiapan unit sebelum diserahkan ke customer."
              action={<button className="dashboard-inline-button">Siapkan pickup</button>}
              columns={deliveryColumns}
              rows={frontDeskDeliveries}
              notes={[
                { title: 'Invoice siap dulu', description: 'Pastikan pembayaran atau billing sudah jelas sebelum customer datang.' },
                { title: 'Penjelasan pekerjaan', description: 'Sampaikan hasil servis dengan singkat, jelas, dan tidak tergesa-gesa.' },
                { title: 'Reminder pickup', description: 'Unit selesai yang belum diambil perlu di-follow-up agar area delivery tetap lega.', tone: 'warning' },
              ]}
            />
          ),
        };
      case 'follow-ups':
        return {
          title: 'Follow-up Customer',
          subtitle: 'Panel komunikasi dibuat sederhana agar mudah dijalankan setiap hari.',
          stats: followUpStats,
          content: (
            <SingleTablePage
              title="Daftar Follow-up"
              subtitle="Customer, kanal komunikasi, tujuan, dan status tindak lanjut."
              action={<button className="dashboard-inline-button">Tambah follow-up</button>}
              columns={followUpColumns}
              rows={frontDeskFollowUps}
              notes={[
                { title: 'Reminder yang ramah', description: 'Gunakan pesan singkat yang sopan dan langsung pada inti informasi.' },
                { title: 'Update status cepat', description: 'Setelah customer merespons, status follow-up sebaiknya langsung diperbarui.' },
                { title: 'Case sensitif', description: 'Keluhan atau hambatan harus ditandai lebih dulu agar tidak terlewat.', tone: 'danger' },
              ]}
            />
          ),
        };
      default:
        return {
          title: 'Front Desk Dashboard',
          subtitle: 'Ringkas, ramah dibaca, dan tetap sejalan dengan identitas visual sistem Anda.',
          stats: frontDeskSummary,
          content: <OverviewContent />,
        };
    }
  }, [section]);

  return (
    <DashboardShell
      title={page.title}
      subtitle={page.subtitle}
      menus={frontDeskMenus}
      roleLabel="Front Desk"
      footerText="Front desk workspace untuk check-in, booking, approval, dan delivery unit."
      breadcrumb={`Dashboard / Front Desk${section ? ` / ${section}` : ''}`}
      searchPlaceholder="Cari customer, booking, approval..."
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

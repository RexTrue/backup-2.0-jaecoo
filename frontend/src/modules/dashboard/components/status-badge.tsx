import type { ServiceStatus } from '../data/admin-dashboard-data';

interface StatusBadgeProps {
  status: ServiceStatus | 'Aktif' | 'Pending' | 'Nonaktif';
}

const statusLabelMap: Record<StatusBadgeProps['status'], string> = {
  ANTRIAN: 'Antrian',
  PROSES_SERVIS: 'Proses Servis',
  SIAP_TEST_DRIVE: 'Siap Test Drive',
  SELESAI: 'Selesai',
  DIAMBIL: 'Diambil',
  TERKENDALA: 'Terkendala',
  Aktif: 'Aktif',
  Pending: 'Pending',
  Nonaktif: 'Nonaktif',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`dashboard-status dashboard-status--${status.toLowerCase().replace(/\s+/g, '-')}`}>
      {statusLabelMap[status]}
    </span>
  );
}

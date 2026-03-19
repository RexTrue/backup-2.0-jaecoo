import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { getUnseenServiceStatusCounts } from '@/common/lib/unseen-notifications';
import { Service, ServiceStatus } from '@/common/types/domain';
import { serviceStatusGlowMap, serviceStatusLabelMap, serviceStatusPanelMap } from '@/common/lib/status-appearance';
import { useUnseenRefresh } from '@/common/hooks/use-unseen-refresh';

const columns: ServiceStatus[] = ['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA'];

export function ServiceBoard({ services, baseSearch = '' }: { services: Service[]; baseSearch?: string }) {
  const role = useAuthStore((state) => state.user?.role);
  useUnseenRefresh();
  const unseenCounts = useMemo(() => getUnseenServiceStatusCounts(role, services), [role, services]);

  return (
    <div className="pb-2">
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {columns.map((status) => {
          const count = services.filter((item) => item.status === status).length;
          const href = `/services/status/${status}${baseSearch ? `?search=${encodeURIComponent(baseSearch)}` : ''}`;
          return (
            <Link
              key={status}
              to={href}
              className={`glass-soft rounded-[28px] border p-4 transition duration-300 hover:-translate-y-0.5 ${serviceStatusPanelMap[status]} ${serviceStatusGlowMap[status]}`}
            >
              <header className="flex items-center justify-between rounded-[20px] border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold theme-text">{serviceStatusLabelMap[status]}</h2>
                    {unseenCounts[status] > 0 ? <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-[0_0_0_4px_rgba(239,68,68,0.18)]">{unseenCounts[status]}</span> : null}
                  </div>
                  <p className="mt-1 text-xs theme-muted">Buka daftar WO sesuai status ini</p>
                </div>
                <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel-light)] px-3 py-1 text-sm font-semibold theme-text">{count}</span>
              </header>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

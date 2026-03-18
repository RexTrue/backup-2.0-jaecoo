import { useNavigate } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { StatusBadge } from '@/common/components/data-display/status-badge';
import { serviceStatusGlowMap, serviceStatusPanelMap } from '@/common/lib/status-appearance';
import { DashboardConfig } from '@/modules/dashboard/types/dashboard.types';

export function DashboardWorkOrderSection({ config }: { config: DashboardConfig }) {
  const navigate = useNavigate();

  return (
    <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <Card>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Work Order</p>
          <h3 className="mt-3 text-xl font-semibold">Active List</h3>
        </div>

        <div className="mt-5 overflow-hidden rounded-[24px] border border-[color:var(--line)]">
          <div className="hidden grid-cols-[1.15fr_1fr_1.2fr_0.8fr] gap-3 border-b border-[color:var(--line)] bg-[color:var(--panel-light)] px-4 py-3 text-xs uppercase tracking-[0.18em] theme-muted md:grid">
            <span>WO</span>
            <span>Kendaraan</span>
            <span>Status</span>
            <span>Masuk</span>
          </div>
          <div className="divide-y divide-[color:var(--line)]">
            {config.activeList.map((item) => (
              <button type="button" key={item.wo} onClick={() => navigate('/work-orders')} className="w-full px-4 py-4 text-left text-sm theme-text transition duration-300 hover:bg-[color:var(--panel-light)] hover:-translate-y-0.5">
                <div className="space-y-3 md:hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{item.wo}</p>
                      <p className="mt-1 text-xs theme-muted">{item.plate}</p>
                    </div>
                    <span className="text-xs theme-muted">{item.time}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel-light)] px-2.5 py-1 text-xs theme-muted">{item.model}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <div className="hidden grid-cols-[1.15fr_1fr_1.2fr_0.8fr] gap-3 md:grid">
                  <div className="min-w-0">
                    <p className="font-semibold">{item.wo}</p>
                    <p className="mt-1 truncate text-xs theme-muted">{item.plate}</p>
                  </div>
                  <span>{item.model}</span>
                  <div className="min-w-0">
                    <StatusBadge status={item.status} />
                  </div>
                  <span>{item.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-[0.28em] theme-muted">Prioritas</p>
        <div className="mt-5 space-y-3">
          {config.priorityList.map((item) => (
            <button
              type="button"
              onClick={() => navigate(item.href)}
              key={`${item.title}-${item.status}`}
              className={`w-full rounded-[22px] border p-4 text-left transition hover:-translate-y-1 ${serviceStatusPanelMap[item.status]} ${serviceStatusGlowMap[item.status]}`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="min-w-0 text-sm font-semibold leading-5 theme-text">{item.title}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-sm leading-6 theme-muted">{item.note}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
}

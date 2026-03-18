import { useNavigate } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { StatusBadge } from '@/common/components/data-display/status-badge';
import { serviceStatusGlowMap, serviceStatusLabelMap, serviceStatusPanelMap } from '@/common/lib/status-appearance';
import { DashboardConfig } from '@/modules/dashboard/types/dashboard.types';
import { dashboardOrderedStatuses } from '@/modules/dashboard/mocks/dashboard.mock';

export function DashboardStatusOverview({ config }: { config: DashboardConfig }) {
  const navigate = useNavigate();

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Status</p>
          <h3 className="mt-3 text-xl font-semibold">Board Snapshot</h3>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardOrderedStatuses.map((status) => (
            <button
              type="button"
              onClick={() => navigate('/services')}
              key={status}
              className={`rounded-[22px] border p-4 text-left transition duration-300 hover:-translate-y-1 hover:scale-[1.01] ${serviceStatusPanelMap[status]} ${serviceStatusGlowMap[status]}`}
            >
              <div className="space-y-3">
                <p className="text-sm leading-5 theme-text">{serviceStatusLabelMap[status]}</p>
                <StatusBadge status={status} />
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight theme-text">{config.statusCounts[status]}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-[0.28em] theme-muted">Timeline</p>
        <div className="mt-5 space-y-3">
          {config.timeline.map((item) => (
            <button
              type="button"
              onClick={() => navigate('/services')}
              key={`${item.time}-${item.text}`}
              className={`flex items-center gap-4 rounded-[22px] border p-4 text-left transition duration-300 hover:-translate-y-1 hover:scale-[1.01] ${serviceStatusPanelMap[item.status]}`}
            >
              <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-[18px] border border-[color:var(--line)] bg-[color:var(--panel-light)] px-3 text-center text-sm font-semibold theme-text">{item.time}</span>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm leading-6 theme-text">{item.text}</p>
                <StatusBadge status={item.status} />
              </div>
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
}

import { useAuthStore } from '@/modules/auth/store/auth-store';
import { DashboardHeroSection } from '@/modules/dashboard/components/dashboard-hero-section';
import { DashboardKpiCardView } from '@/modules/dashboard/components/dashboard-kpi-card';
import { DashboardStatusOverview } from '@/modules/dashboard/components/dashboard-status-overview';
import { DashboardWorkOrderSection } from '@/modules/dashboard/components/dashboard-work-order-section';
import { getDashboardConfigByRole } from '@/modules/dashboard/mocks/dashboard.mock';

export function DashboardPage() {
  const role = useAuthStore((state) => state.user?.role);
  const config = getDashboardConfigByRole(role);

  return (
    <div className="space-y-5">
      <DashboardHeroSection config={config} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {config.kpis.map((item) => (
          <DashboardKpiCardView key={item.label} card={item} />
        ))}
      </section>

      <DashboardStatusOverview config={config} />
      <DashboardWorkOrderSection config={config} />
    </div>
  );
}

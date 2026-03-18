import { Service, ServiceStatus } from '@/common/types/domain';
import { ServiceCard } from '@/modules/services/components/service-card';
import { serviceStatusGlowMap, serviceStatusLabelMap, serviceStatusPanelMap } from '@/common/lib/status-appearance';

const columns: ServiceStatus[] = ['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA'];

export function ServiceBoard({ services }: { services: Service[] }) {
  return (
    <div className="pb-2">
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {columns.map((status) => {
          const count = services.filter((item) => item.status === status).length;
          return (
            <section
              key={status}
              className={`glass-soft rounded-[28px] border p-3 ${serviceStatusPanelMap[status]} ${serviceStatusGlowMap[status]}`}
            >
              <header className="mb-3 flex items-center justify-between rounded-[20px] border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-3">
                <h2 className="text-sm font-semibold theme-text">{serviceStatusLabelMap[status]}</h2>
                <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel-light)] px-2.5 py-1 text-xs theme-muted">{count}</span>
              </header>
              <div className="space-y-3">
                {services.filter((item) => item.status === status).map((service) => (
                  <ServiceCard key={service.id_servis} service={service} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

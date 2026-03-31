import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { Input } from '@/common/components/ui/input';
import { PageHeader } from '@/common/components/page/page-header';
import { getLocalEntities, mergeEntities, useLocalEntities } from '@/common/lib/local-entity-store';
import { ServiceBoard } from '@/modules/services/components/service-board';
import { useServices } from '@/modules/services/hooks/use-services';
import { useWorkOrders } from '@/modules/work-orders/hooks/use-work-orders';
import { buildWorkOrderRecords, filterWorkOrderRecords } from '@/modules/work-orders/lib/work-order-records';
import type { Customer, Service, Vehicle, WorkOrder } from '@/common/types/domain';

export function ServiceBoardPage() {
  const servicesQuery = useServices();
  const workOrdersQuery = useWorkOrders();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';

  const localServices = useLocalEntities<Service>('services');
  const localWorkOrders = useLocalEntities<WorkOrder>('work-orders');
  const localVehicles = useLocalEntities<Vehicle>('vehicles');
  const localCustomers = useLocalEntities<Customer>('customers');

  const services = useMemo(() => mergeEntities(servicesQuery.data ?? [], localServices, (item) => item.id_servis), [localServices, servicesQuery.data]);
  const workOrders = useMemo(() => mergeEntities(workOrdersQuery.data ?? [], localWorkOrders, (item) => item.id_wo), [localWorkOrders, workOrdersQuery.data]);

  const filteredServices = useMemo(() => {
    const records = buildWorkOrderRecords({ workOrders, services, vehicles: localVehicles, customers: localCustomers });
    const visibleRecords = filterWorkOrderRecords(records, search);
    const visibleWorkOrderIds = new Set(visibleRecords.map((record) => record.workOrder.id_wo));
    return services.filter((service) => visibleWorkOrderIds.has(service.id_wo));
  }, [localCustomers, localVehicles, search, services, workOrders]);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Servis" title="Board Servis" />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-sm">
          <Input
            value={search}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value) next.set('search', event.target.value);
              else next.delete('search');
              setSearchParams(next, { replace: true });
            }}
            placeholder="Cari WO, nama pemilik, plat, HP, status, model..."
          />
        </div>
      </div>

      {servicesQuery.isLoading || workOrdersQuery.isLoading ? (
        <LoadingState message="Memuat board servis..." rows={3} />
      ) : (
        <div className="space-y-4">
          <ServiceBoard services={filteredServices} baseSearch={search} />
          {filteredServices.length === 0 ? (
            <EmptyState message={search ? 'Tidak ada data servis yang cocok dengan pencarian.' : 'Belum ada data servis yang terhubung dari work order.'} />
          ) : null}
        </div>
      )}
    </div>
  );
}

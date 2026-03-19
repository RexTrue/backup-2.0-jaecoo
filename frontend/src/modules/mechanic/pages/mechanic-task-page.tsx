import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { StatusBadge } from '@/common/components/data-display/status-badge';
import { Button } from '@/common/components/ui/button';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import type { Customer, Service, ServiceStatus, Vehicle, WorkOrder } from '@/common/types/domain';
import { serviceStatusGlowMap, serviceStatusPanelMap } from '@/common/lib/status-appearance';
import { getLocalEntities, mergeEntities } from '@/common/lib/local-entity-store';
import { useServices } from '@/modules/services/hooks/use-services';
import { useWorkOrders } from '@/modules/work-orders/hooks/use-work-orders';
import { buildWorkOrderRecords } from '@/modules/work-orders/lib/work-order-records';

const boardStatuses: ServiceStatus[] = ['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'TERKENDALA'];

export function MechanicTaskPage() {
  const servicesQuery = useServices();
  const workOrdersQuery = useWorkOrders();

  const localServices = useMemo(() => getLocalEntities<Service>('services'), []);
  const localWorkOrders = useMemo(() => getLocalEntities<WorkOrder>('work-orders'), []);
  const localVehicles = useMemo(() => getLocalEntities<Vehicle>('vehicles'), []);
  const localCustomers = useMemo(() => getLocalEntities<Customer>('customers'), []);

  const services = useMemo(() => mergeEntities(servicesQuery.data ?? [], localServices, (item) => item.id_servis), [localServices, servicesQuery.data]);
  const workOrders = useMemo(() => mergeEntities(workOrdersQuery.data ?? [], localWorkOrders, (item) => item.id_wo), [localWorkOrders, workOrdersQuery.data]);

  const records = useMemo(
    () => buildWorkOrderRecords({ workOrders, services, vehicles: localVehicles, customers: localCustomers }).filter((record) => record.service && boardStatuses.includes(record.service.status)),
    [localCustomers, localVehicles, services, workOrders],
  );

  const statusCounts = boardStatuses.reduce<Record<ServiceStatus, number>>(
    (acc, status) => ({ ...acc, [status]: records.filter((record) => record.service?.status === status).length }),
    { ANTRIAN: 0, DIKERJAKAN: 0, TEST_DRIVE: 0, SELESAI: 0, DIAMBIL: 0, TERKENDALA: 0 },
  );

  const summaryCards = [
    { label: 'Antrian Unit', value: statusCounts.ANTRIAN, note: 'Unit yang menunggu masuk workshop.', status: 'ANTRIAN' as const },
    { label: 'Sedang Dikerjakan', value: statusCounts.DIKERJAKAN, note: 'Unit yang sedang diproses mekanik.', status: 'DIKERJAKAN' as const },
    { label: 'Terkendala', value: statusCounts.TERKENDALA, note: 'Unit yang perlu keputusan atau tindak lanjut tambahan.', status: 'TERKENDALA' as const },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-xs uppercase tracking-[0.28em] theme-muted">Mekanik</p>
        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h1 className="section-title">Workshop Progress</h1>
          <p className="max-w-2xl text-sm leading-6 theme-muted">Ringkasan sederhana untuk melihat kendaraan yang sedang diproses di area workshop.</p>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {summaryCards.map((item) => (
            <div key={item.label} className={`rounded-[24px] border p-5 ${serviceStatusPanelMap[item.status]} ${serviceStatusGlowMap[item.status]}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-6 theme-text">{item.label}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-6 text-5xl font-semibold leading-none tracking-tight theme-text">{item.value}</p>
              <p className="mt-4 text-sm leading-6 theme-muted">{item.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Status</p>
          <h2 className="mt-3 text-xl font-semibold">Board Snapshot</h2>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {boardStatuses.map((status) => (
            <Link key={status} to={`/services/status/${status}`} className={`rounded-[22px] border p-4 transition duration-300 hover:-translate-y-0.5 ${serviceStatusPanelMap[status]} ${serviceStatusGlowMap[status]}`}>
              <StatusBadge status={status} />
              <p className="mt-4 text-3xl font-semibold tracking-tight theme-text">{statusCounts[status]}</p>
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Work Order</p>
          <h2 className="mt-3 text-xl font-semibold">Active List</h2>
        </div>

        {servicesQuery.isLoading || workOrdersQuery.isLoading ? (
          <LoadingState message="Memuat pekerjaan mekanik..." rows={3} />
        ) : records.length === 0 ? (
          <div className="mt-5"><EmptyState message="Belum ada kendaraan yang masuk ke workflow workshop." /></div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {records.slice(0, 6).map((record) => (
              <div key={`${record.workOrder.id_wo}-${record.service?.id_servis ?? 'noservice'}`} className={`space-y-4 rounded-[24px] border p-5 ${serviceStatusPanelMap[record.service?.status ?? 'ANTRIAN']} ${serviceStatusGlowMap[record.service?.status ?? 'ANTRIAN']}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] theme-muted">{record.workOrderCode}</p>
                    <h3 className="mt-2 text-xl font-semibold theme-text">{record.vehicle?.jenis_mobil ?? record.workOrder.no_rangka}</h3>
                    <p className="mt-1 text-sm theme-muted">Pelanggan: {record.customer?.nama ?? 'Belum terhubung'}</p>
                  </div>
                  <StatusBadge status={record.service?.status ?? 'ANTRIAN'} />
                </div>
                <p className="text-sm theme-muted">Keluhan: {record.service?.keluhan ?? '-'}</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {record.service ? <Link to={`/services/${record.service.id_servis}`}><Button variant="secondary">Detail</Button></Link> : null}
                  <Button variant="secondary" disabled>Catatan</Button>
                  <Button disabled={record.service?.status === 'SELESAI'}>Finish</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

import type { Customer, Service, Vehicle, WorkOrder } from '@/common/types/domain';
import { formatWorkOrderCode } from '@/common/lib/work-order-code';

export type WorkOrderRecord = {
  workOrder: WorkOrder;
  service?: Service;
  customer?: Customer;
  vehicle?: Vehicle;
  workOrderCode: string;
  searchableText: string;
};

export function buildWorkOrderRecords({
  workOrders,
  services,
  vehicles,
  customers,
}: {
  workOrders: WorkOrder[];
  services: Service[];
  vehicles: Vehicle[];
  customers: Customer[];
}): WorkOrderRecord[] {
  const serviceByWo = new Map(services.map((item) => [item.id_wo, item]));
  const vehicleByVin = new Map(vehicles.map((item) => [item.no_rangka, item]));
  const customerByNik = new Map(customers.map((item) => [item.nik, item]));

  return workOrders.map((workOrder) => {
    const service = serviceByWo.get(workOrder.id_wo);
    const vehicle = vehicleByVin.get(workOrder.no_rangka);
    const customer = vehicle ? customerByNik.get(vehicle.nik_pemilik) : undefined;
    const workOrderCode = formatWorkOrderCode(workOrder);

    const searchableText = [
      workOrderCode,
      workOrder.id_wo,
      workOrder.status,
      workOrder.no_rangka,
      service?.keluhan,
      service?.status,
      service?.prioritas,
      vehicle?.plat_nomor,
      vehicle?.jenis_mobil,
      vehicle?.warna,
      vehicle?.nik_pemilik,
      customer?.nama,
      customer?.no_hp,
      customer?.alamat,
      customer?.nik,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return {
      workOrder,
      service,
      vehicle,
      customer,
      workOrderCode,
      searchableText,
    };
  });
}

export function filterWorkOrderRecords(records: WorkOrderRecord[], search: string) {
  const keyword = search.trim().toLowerCase();
  if (!keyword) return records;
  return records.filter((record) => record.searchableText.includes(keyword));
}

export function sortWorkOrderRecords(records: WorkOrderRecord[], sortBy: 'newest' | 'oldest') {
  const sorted = [...records].sort((a, b) => {
    const left = new Date(a.workOrder.waktuMasuk || 0).getTime();
    const right = new Date(b.workOrder.waktuMasuk || 0).getTime();
    return sortBy === 'oldest' ? left - right : right - left;
  });
  return sorted;
}

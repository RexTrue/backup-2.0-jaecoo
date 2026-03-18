import { unwrapApiCollection, unwrapApiSingle } from '@/common/lib/api-response';
import { mapWorkOrderFromBackend } from '@/common/lib/backend-mappers';
import type { WorkOrder } from '@/common/types/domain';
import type { BackendWorkOrder } from '@/modules/work-orders/types/work-order.api';
import type { CreateWorkOrderPayload } from '@/modules/work-orders/types/work-order.types';
import { apiClient } from '@/services/api-client';
import { endpoints } from '@/services/endpoints';

export async function getWorkOrders(): Promise<WorkOrder[]> {
  const { data } = await apiClient.get<BackendWorkOrder[] | { data?: BackendWorkOrder[] }>(endpoints.workOrders.list);
  return unwrapApiCollection(data).map((item) => mapWorkOrderFromBackend(item as Record<string, unknown>));
}

export async function createWorkOrder(payload: CreateWorkOrderPayload): Promise<WorkOrder> {
  const { data } = await apiClient.post<BackendWorkOrder | { data?: BackendWorkOrder }>(endpoints.workOrders.create, payload);
  return mapWorkOrderFromBackend(unwrapApiSingle(data) as Record<string, unknown>);
}

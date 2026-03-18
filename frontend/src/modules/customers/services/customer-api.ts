import { unwrapApiCollection, unwrapApiSingle } from '@/common/lib/api-response';
import { mapCustomerFromBackend } from '@/common/lib/backend-mappers';
import type { Customer } from '@/common/types/domain';
import type { BackendCustomer } from '@/modules/customers/types/customer.api';
import type { CreateCustomerPayload } from '@/modules/customers/types/customer.types';
import { apiClient } from '@/services/api-client';
import { endpoints } from '@/services/endpoints';

export async function getCustomers(): Promise<Customer[]> {
  const { data } = await apiClient.get<BackendCustomer[] | { data?: BackendCustomer[] }>(endpoints.customers.list);
  return unwrapApiCollection(data).map((item) => mapCustomerFromBackend(item as Record<string, unknown>));
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
  const { data } = await apiClient.post<BackendCustomer | { data?: BackendCustomer }>(endpoints.customers.create, payload);
  return mapCustomerFromBackend(unwrapApiSingle(data) as Record<string, unknown>);
}

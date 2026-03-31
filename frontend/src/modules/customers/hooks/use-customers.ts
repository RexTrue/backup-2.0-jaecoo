import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { createCustomer, deleteCustomer, getCustomers } from '@/modules/customers/services/customer-api';
import { removeLocalEntity } from '@/common/lib/local-entity-store';
import type { Customer } from '@/common/types/domain';

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: getCustomers,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (_, nik) => {
      // Remove from local storage
      removeLocalEntity<Customer>('customers', (customer) => customer.nik, nik);
      // Invalidate queries to refresh data
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers });
    },
  });
}

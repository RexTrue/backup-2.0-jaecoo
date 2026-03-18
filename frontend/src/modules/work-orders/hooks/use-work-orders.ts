import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { createWorkOrder, getWorkOrders } from '@/modules/work-orders/services/work-order-api';

export function useWorkOrders() {
  return useQuery({
    queryKey: queryKeys.workOrders,
    queryFn: getWorkOrders,
  });
}

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workOrders });
      void queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

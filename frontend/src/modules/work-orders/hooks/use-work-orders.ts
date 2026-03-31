import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { createWorkOrder, deleteWorkOrder, getWorkOrders } from '@/modules/work-orders/services/work-order-api';
import { removeLocalEntity } from '@/common/lib/local-entity-store';

const MAX_INT_32 = 2147483647;

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

export function useDeleteWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const parsed = Number(id);
      const isServerCompatibleId =
        Number.isInteger(parsed) && parsed > 0 && parsed <= MAX_INT_32;

      if (!isServerCompatibleId) {
        // Offline/local records may use large timestamp IDs that don't exist in DB.
        return { success: true, message: 'Work order lokal berhasil dihapus' };
      }

      return deleteWorkOrder(id);
    },
    onSuccess: (_, id) => {
      // Remove from local cache and storage
      removeLocalEntity('work-orders', (wo) => (wo as { id_wo: number }).id_wo, id);
      void queryClient.invalidateQueries({ queryKey: queryKeys.workOrders });
      void queryClient.invalidateQueries({ queryKey: queryKeys.services });
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers });
    },
  });
}

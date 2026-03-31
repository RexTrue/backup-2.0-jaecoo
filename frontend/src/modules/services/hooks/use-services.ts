import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import {
  createMechanicNote,
  createService,
  deleteService,
  getServiceDetail,
  getServices,
  updateServiceStatus,
} from '@/modules/services/services/service-api';
import { removeLocalEntity } from '@/common/lib/local-entity-store';

const MAX_INT_32 = 2147483647;

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: getServices,
  });
}

export function useServiceDetail(serviceId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.serviceDetail(serviceId),
    queryFn: () => getServiceDetail(serviceId),
    enabled: options?.enabled ?? Boolean(serviceId),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: (service) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.services });
      void queryClient.setQueryData(queryKeys.serviceDetail(service.id_servis), service);
    },
  });
}

export function useUpdateServiceStatus(serviceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateServiceStatus>[1]) => updateServiceStatus(serviceId, payload),
    onSuccess: (service) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.services });
      void queryClient.setQueryData(queryKeys.serviceDetail(service.id_servis), service);
    },
  });
}

export function useCreateMechanicNote(serviceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof createMechanicNote>[1]) => createMechanicNote(serviceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.serviceDetail(serviceId) });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const parsed = Number(serviceId);
      const isServerCompatibleId = Number.isInteger(parsed) && parsed > 0 && parsed <= MAX_INT_32;

      if (!isServerCompatibleId) {
        return { success: true, message: 'Servis lokal berhasil dihapus' };
      }

      return deleteService(serviceId);
    },
    onSuccess: (_, serviceId) => {
      removeLocalEntity('services', (service) => (service as { id_servis: number }).id_servis, Number(serviceId));
      void queryClient.invalidateQueries({ queryKey: queryKeys.services });
      void queryClient.invalidateQueries({ queryKey: queryKeys.serviceDetail(serviceId) });
    },
  });
}

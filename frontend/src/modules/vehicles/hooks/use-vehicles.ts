import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { createVehicle, deleteVehicle, getVehicles } from '@/modules/vehicles/services/vehicle-api';
import { removeLocalEntity } from '@/common/lib/local-entity-store';
import type { Vehicle } from '@/common/types/domain';

export function useVehicles() {
  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: getVehicles,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: (_, noRangka) => {
      // Remove from local storage
      removeLocalEntity<Vehicle>('vehicles', (vehicle) => vehicle.no_rangka, noRangka);
      // Invalidate queries to refresh data
      void queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
}

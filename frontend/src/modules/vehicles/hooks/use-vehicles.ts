import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { createVehicle, getVehicles } from '@/modules/vehicles/services/vehicle-api';

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

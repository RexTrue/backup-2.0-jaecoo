import { unwrapApiCollection, unwrapApiSingle } from '@/common/lib/api-response';
import { mapVehicleFromBackend } from '@/common/lib/backend-mappers';
import type { Vehicle } from '@/common/types/domain';
import type { BackendVehicle } from '@/modules/vehicles/types/vehicle.api';
import type { CreateVehiclePayload } from '@/modules/vehicles/types/vehicle.types';
import { apiClient } from '@/services/api-client';
import { endpoints } from '@/services/endpoints';

export async function getVehicles(): Promise<Vehicle[]> {
  const { data } = await apiClient.get<BackendVehicle[] | { data?: BackendVehicle[] }>(endpoints.vehicles.list);
  return unwrapApiCollection(data).map((item) => mapVehicleFromBackend(item as Record<string, unknown>));
}

export async function createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
  const { data } = await apiClient.post<BackendVehicle | { data?: BackendVehicle }>(endpoints.vehicles.create, payload);
  return mapVehicleFromBackend(unwrapApiSingle(data) as Record<string, unknown>);
}

export async function deleteVehicle(noRangka: string) {
  const { data } = await apiClient.delete<Record<string, unknown>>(endpoints.vehicles.detail(noRangka));
  return data;
}

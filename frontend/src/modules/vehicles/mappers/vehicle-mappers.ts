import type { Vehicle } from '@/common/types/domain';
import type { BackendVehicle } from '@/modules/vehicles/types/vehicle.api';
import type { VehicleListRow } from '@/modules/vehicles/types/vehicle.types';
import { getVehicleImageByModel } from '@/common/lib/vehicle-images';

export function mapVehicleFromApi(input: BackendVehicle): Vehicle {
  return {
    no_rangka: String(input.no_rangka ?? ''),
    plat_nomor: String(input.plat_nomor ?? ''),
    jenis_mobil: input.jenis_mobil == null ? null : String(input.jenis_mobil),
    warna: input.warna == null ? null : String(input.warna),
    tahun: input.tahun == null ? null : Number(input.tahun),
    kilometer: Number(input.kilometer ?? 0),
    nik_pemilik: String(input.nik_pemilik ?? ''),
    createdAt: String(input.createdAt ?? ''),
  };
}

export function mapVehicleToListRow(input: Vehicle): VehicleListRow {
  const image = getVehicleImageByModel(input.jenis_mobil);

  return {
    plate: input.plat_nomor,
    unit: input.jenis_mobil || '-',
    km: `${input.kilometer.toLocaleString('id-ID')} km`,
    color: input.warna || '-',
    imageSrc: image.src,
    imageAlt: image.alt,
  };
}

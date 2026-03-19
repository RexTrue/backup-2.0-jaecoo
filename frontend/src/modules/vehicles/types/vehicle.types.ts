export interface CreateVehiclePayload {
  no_rangka: string;
  plat_nomor: string;
  jenis_mobil?: string | null;
  warna?: string | null;
  tahun?: number | null;
  kilometer: number;
  nik_pemilik: string;
}

export interface VehicleListRow {
  plate: string;
  unit: string;
  km: string;
  color: string;
  imageSrc: string;
  imageAlt: string;
}

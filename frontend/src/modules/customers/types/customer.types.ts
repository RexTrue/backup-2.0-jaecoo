export interface CreateCustomerPayload {
  nik: string;
  nama: string;
  no_hp?: string | null;
  alamat?: string | null;
}

export interface CustomerListRow {
  nik: string;
  name: string;
  phone: string;
  units: number;
}

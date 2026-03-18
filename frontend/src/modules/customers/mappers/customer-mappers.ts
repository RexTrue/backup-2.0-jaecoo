import type { Customer } from '@/common/types/domain';
import type { BackendCustomer } from '@/modules/customers/types/customer.api';
import type { CustomerListRow } from '@/modules/customers/types/customer.types';

export function mapCustomerFromApi(input: BackendCustomer): Customer {
  return {
    nik: String(input.nik ?? ''),
    nama: String(input.nama ?? ''),
    no_hp: input.no_hp == null ? null : String(input.no_hp),
    alamat: input.alamat == null ? null : String(input.alamat),
    createdAt: String(input.createdAt ?? ''),
  };
}

export function mapCustomerToListRow(input: Customer): CustomerListRow {
  return {
    nik: input.nik,
    name: input.nama,
    phone: input.no_hp || '-',
    units: 1,
  };
}

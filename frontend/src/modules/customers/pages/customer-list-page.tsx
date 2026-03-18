import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/common/components/ui/card';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { ErrorState } from '@/common/components/feedback/error-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Button } from '@/common/components/ui/button';
import { FieldError, FieldHint, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { ListCard } from '@/common/components/data-display/list-card';
import { PageHeader } from '@/common/components/page/page-header';
import { shouldUseMockFallback } from '@/common/lib/query-fallback';
import { customerRowsMock } from '@/modules/customers/mocks/customer.mock';
import { useCreateCustomer, useCustomers } from '@/modules/customers/hooks/use-customers';
import { mapCustomerToListRow } from '@/modules/customers/mappers/customer-mappers';
import type { CreateCustomerPayload } from '@/modules/customers/types/customer.types';

const schema = z.object({
  nik: z.string().min(8, 'NIK minimal 8 karakter'),
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  no_hp: z.string().optional(),
  alamat: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CustomerListPage() {
  const [lastPayload, setLastPayload] = useState<CreateCustomerPayload>();
  const [submitState, setSubmitState] = useState<string>();
  const customersQuery = useCustomers();
  const customers = customersQuery.data;
  const createCustomerMutation = useCreateCustomer();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nik: '', nama: '', no_hp: '', alamat: '' },
  });

  const rows = useMemo(() => (customers?.length ? customers.map(mapCustomerToListRow) : []), [customers]);
  const useMockData = shouldUseMockFallback(customersQuery.isError);

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateCustomerPayload = {
      nik: values.nik,
      nama: values.nama,
      no_hp: values.no_hp || null,
      alamat: values.alamat || null,
    };
    setLastPayload(payload);

    try {
      await createCustomerMutation.mutateAsync(payload);
      setSubmitState('Payload pelanggan berhasil dikirim.');
      reset();
    } catch {
      setSubmitState('Payload pelanggan siap integrasi. Endpoint backend belum merespons.');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Pelanggan" title="Pelanggan" />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <FormShell eyebrow="Form" title="Input Pelanggan" subtitle="Field mengikuti tabel Pemilik pada database.">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div>
              <FieldLabel htmlFor="nik">NIK</FieldLabel>
              <Input id="nik" placeholder="3401123456780001" {...register('nik')} />
              <FieldError>{errors.nik?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="nama">Nama</FieldLabel>
              <Input id="nama" placeholder="Nama pelanggan" {...register('nama')} />
              <FieldError>{errors.nama?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="no_hp">No HP</FieldLabel>
              <Input id="no_hp" placeholder="08xxxxxxxxxx" {...register('no_hp')} />
              <FieldHint>Opsional.</FieldHint>
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="alamat">Alamat</FieldLabel>
              <Textarea id="alamat" placeholder="Alamat pelanggan" {...register('alamat')} />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isSubmitting || createCustomerMutation.isPending}>Simpan Pelanggan</Button>
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>

        <div className="space-y-4">
          <PayloadPreview title="Payload Pelanggan" payload={lastPayload} />
        </div>
      </div>
      <Card>
        {customersQuery.isLoading ? (
          <LoadingState message="Memuat daftar pelanggan..." rows={3} />
        ) : useMockData ? (
          <div className="space-y-4">
            <ErrorState message="Data pelanggan backend belum tersedia." description="Menampilkan data contoh sementara agar alur UI tetap bisa dicek." />
            <div className="grid gap-3">
              {customerRowsMock.map((row) => (
                <ListCard
                  key={row.nik}
                  title={row.name}
                  subtitle={<p className="text-xs theme-muted">NIK {row.nik}</p>}
                  meta={<div className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-1 text-xs theme-muted">{row.units} kendaraan</div>}
                  footer={(
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm theme-muted">Kontak: {row.phone}</p>
                      <div className="action-strip">
                        <Button variant="secondary" type="button">Edit</Button>
                        <Button variant="danger" type="button">Hapus</Button>
                      </div>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
        ) : rows.length === 0 ? (
          <EmptyState message="Belum ada data pelanggan. Tambahkan pelanggan pertama untuk mulai sinkronisasi dengan backend." />
        ) : (
          <div className="grid gap-3">
            {rows.map((row) => (
              <ListCard
                key={row.nik}
                title={row.name}
                subtitle={<p className="text-xs theme-muted">NIK {row.nik}</p>}
                meta={<div className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-1 text-xs theme-muted">{row.units} kendaraan</div>}
                footer={(
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm theme-muted">Kontak: {row.phone}</p>
                    <div className="action-strip">
                      <Button variant="secondary" type="button">Edit</Button>
                      <Button variant="danger" type="button">Hapus</Button>
                    </div>
                  </div>
                )}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

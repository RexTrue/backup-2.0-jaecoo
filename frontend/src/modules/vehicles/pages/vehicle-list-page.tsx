import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/common/components/ui/card';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { ErrorState } from '@/common/components/feedback/error-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Select } from '@/common/components/ui/select';
import { FieldError, FieldHint, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { FormDirtyBanner } from '@/common/components/forms/form-dirty-banner';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { ListCard } from '@/common/components/data-display/list-card';
import { PageHeader } from '@/common/components/page/page-header';
import { PermissionGate } from '@/common/components/auth/permission-gate';
import { getVehicleImageByModel } from '@/common/lib/vehicle-images';
import { shouldUseMockFallback } from '@/common/lib/query-fallback';
import { useUnsavedChanges } from '@/common/hooks/use-unsaved-changes';
import { vehicleRowsMock } from '@/modules/vehicles/mocks/vehicle.mock';
import { useCreateVehicle, useVehicles } from '@/modules/vehicles/hooks/use-vehicles';
import { mapVehicleToListRow } from '@/modules/vehicles/mappers/vehicle-mappers';
import type { CreateVehiclePayload } from '@/modules/vehicles/types/vehicle.types';

const schema = z.object({
  no_rangka: z.string().min(5, 'Nomor rangka minimal 5 karakter'),
  plat_nomor: z.string().min(3, 'Plat nomor wajib diisi'),
  jenis_mobil: z.string().optional(),
  warna: z.string().optional(),
  tahun: z.coerce.number().int().min(2000).max(2100).optional(),
  kilometer: z.coerce.number().int().min(0, 'Kilometer tidak boleh negatif'),
  nik_pemilik: z.string().min(8, 'NIK pemilik minimal 8 karakter'),
});

type FormValues = z.infer<typeof schema>;

export function VehicleListPage() {
  const [lastPayload, setLastPayload] = useState<CreateVehiclePayload>();
  const [submitState, setSubmitState] = useState<string>();
  const vehiclesQuery = useVehicles();
  const vehicles = vehiclesQuery.data;
  const createVehicleMutation = useCreateVehicle();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { no_rangka: '', plat_nomor: '', jenis_mobil: 'JAECOO J7 SHS-P', warna: '', tahun: 2025, kilometer: 0, nik_pemilik: '' },
  });

  useUnsavedChanges({ when: isDirty });

  const selectedModel = watch('jenis_mobil') || 'JAECOO J7 SHS-P';
  const vehicleImage = getVehicleImageByModel(selectedModel);
  const rows = useMemo(() => (vehicles?.length ? vehicles.map(mapVehicleToListRow) : []), [vehicles]);
  const useMockData = shouldUseMockFallback(vehiclesQuery.isError);

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateVehiclePayload = {
      no_rangka: values.no_rangka,
      plat_nomor: values.plat_nomor,
      jenis_mobil: values.jenis_mobil || null,
      warna: values.warna || null,
      tahun: values.tahun ?? null,
      kilometer: values.kilometer,
      nik_pemilik: values.nik_pemilik,
    };
    setLastPayload(payload);

    try {
      await createVehicleMutation.mutateAsync(payload);
      setSubmitState('Payload kendaraan berhasil dikirim.');
      showToast({ title: 'Kendaraan disimpan', description: 'Payload kendaraan berhasil dikirim ke service layer.', tone: 'success' });
      reset();
    } catch {
      setSubmitState('Payload kendaraan siap integrasi. Endpoint backend belum merespons.');
      showToast({ title: 'Backend belum merespons', description: 'Payload kendaraan tetap bisa diperiksa di panel preview.', tone: 'info' });
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Kendaraan" title="Kendaraan" />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <FormShell eyebrow="Form" title="Input Kendaraan" subtitle="Field mengikuti tabel Kendaraan pada database.">
          <FormDirtyBanner visible={isDirty} />
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="no_rangka">Nomor Rangka</FieldLabel>
              <Input id="no_rangka" placeholder="MHCJAECOOJ7YOGYA01" {...register('no_rangka')} />
              <FieldError>{errors.no_rangka?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="plat_nomor">Plat Nomor</FieldLabel>
              <Input id="plat_nomor" placeholder="AB 1234 JQ" {...register('plat_nomor')} />
              <FieldError>{errors.plat_nomor?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="nik_pemilik">NIK Pemilik</FieldLabel>
              <Input id="nik_pemilik" placeholder="3401123456780001" {...register('nik_pemilik')} />
              <FieldError>{errors.nik_pemilik?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="jenis_mobil">Model</FieldLabel>
              <Select id="jenis_mobil" {...register('jenis_mobil')}>
                <option value="JAECOO J7 SHS-P">JAECOO J7 SHS-P</option>
                <option value="JAECOO J7 AWD">JAECOO J7 AWD</option>
                <option value="JAECOO J8 AWD">JAECOO J8 AWD</option>
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="warna">Warna</FieldLabel>
              <Input id="warna" placeholder="Hitam" {...register('warna')} />
            </div>
            <div>
              <FieldLabel htmlFor="tahun">Tahun</FieldLabel>
              <Input id="tahun" type="number" {...register('tahun')} />
              <FieldHint>Gunakan tahun model kendaraan.</FieldHint>
            </div>
            <div>
              <FieldLabel htmlFor="kilometer">Kilometer</FieldLabel>
              <Input id="kilometer" type="number" {...register('kilometer')} />
              <FieldError>{errors.kilometer?.message}</FieldError>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isSubmitting || createVehicleMutation.isPending}>Simpan Kendaraan</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  if (!isDirty) return reset();
                  const approved = await confirm({ title: 'Reset form kendaraan?', description: 'Perubahan yang belum disimpan akan hilang.' });
                  if (approved) {
                    reset();
                    showToast({ title: 'Form direset', description: 'Input kendaraan kembali ke nilai awal.' });
                  }
                }}
              >
                Reset
              </Button>
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>

        <div className="space-y-4">
          <Card className="overflow-hidden p-0">
            <img src={vehicleImage.src} alt={vehicleImage.alt} className="h-52 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.28em] theme-muted">Preview</p>
              <h2 className="mt-3 text-2xl font-semibold">{selectedModel}</h2>
            </div>
          </Card>
          <PayloadPreview title="Payload Kendaraan" payload={lastPayload} />
        </div>
      </div>
      <Card>
        {vehiclesQuery.isLoading ? (
          <LoadingState message="Memuat daftar kendaraan..." rows={3} />
        ) : useMockData ? (
          <div className="space-y-4">
            <ErrorState message="Data kendaraan backend belum tersedia." description="Menampilkan data contoh sementara agar list dan visual kendaraan tetap bisa diuji." />
            <div className="grid gap-3">
              {vehicleRowsMock.map((row) => (
                <ListCard
                  key={row.plate}
                  title={row.unit}
                  subtitle={<p className="text-xs theme-muted">{row.plate} · Warna {row.color}</p>}
                  meta={<div className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-1 text-xs theme-muted">{row.km}</div>}
                  footer={(
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm theme-muted">Plat: {row.plate}</p>
                      <PermissionGate permission="vehicles:view">
                        <div className="action-strip">
                          <Button variant="secondary" type="button">Edit</Button>
                          <Button
                            variant="danger"
                            type="button"
                            onClick={async () => {
                              const approved = await confirm({ title: `Hapus kendaraan ${row.plate}?`, description: 'Aksi ini masih simulasi frontend.', confirmLabel: 'Hapus', tone: 'danger' });
                              if (approved) showToast({ title: 'Aksi hapus dicatat', description: 'Endpoint delete kendaraan belum diaktifkan.', tone: 'info' });
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </PermissionGate>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
        ) : rows.length === 0 ? (
          <EmptyState message="Belum ada data kendaraan. Tambahkan unit pertama untuk mulai sinkronisasi dengan backend." />
        ) : (
          <div className="grid gap-3">
            {rows.map((row) => (
              <ListCard
                key={row.plate}
                title={row.unit}
                subtitle={<p className="text-xs theme-muted">{row.plate} · Warna {row.color}</p>}
                meta={<div className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-1 text-xs theme-muted">{row.km}</div>}
                footer={(
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm theme-muted">Plat: {row.plate}</p>
                    <PermissionGate permission="vehicles:view">
                      <div className="action-strip">
                        <Button variant="secondary" type="button">Edit</Button>
                        <Button
                          variant="danger"
                          type="button"
                          onClick={async () => {
                            const approved = await confirm({ title: `Hapus kendaraan ${row.plate}?`, description: 'Aksi ini akan dihubungkan ke endpoint kendaraan pada tahap backend.', confirmLabel: 'Hapus', tone: 'danger' });
                            if (approved) showToast({ title: 'Aksi hapus dicatat', description: 'Endpoint delete kendaraan belum diaktifkan.', tone: 'info' });
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    </PermissionGate>
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

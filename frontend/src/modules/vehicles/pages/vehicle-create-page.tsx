import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select } from '@/common/components/ui/select';
import { Card } from '@/common/components/ui/card';
import { FieldError, FieldHint, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { FormDirtyBanner } from '@/common/components/forms/form-dirty-banner';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { PageHeader } from '@/common/components/page/page-header';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { useUnsavedChanges } from '@/common/hooks/use-unsaved-changes';
import { getVehicleImageByModel } from '@/common/lib/vehicle-images';
import { appendLocalEntity } from '@/common/lib/local-entity-store';
import { useCreateVehicle } from '@/modules/vehicles/hooks/use-vehicles';
import type { Vehicle } from '@/common/types/domain';
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

const modelOptions = [
  'JAECOO J5 EV',
  'JAECOO J7 SHS-P',
  'JAECOO J7 AWD',
  'JAECOO J8 AWD',
  'JAECOO J8 ARDIS',
  'JAECOO J8 SHS-P ARDIS',
] as const;

export function VehicleCreatePage() {
  const [lastPayload, setLastPayload] = useState<CreateVehiclePayload>();
  const [submitState, setSubmitState] = useState<string>();
  const navigate = useNavigate();
  const createVehicleMutation = useCreateVehicle();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { no_rangka: '', plat_nomor: '', jenis_mobil: 'JAECOO J5 EV', warna: '', tahun: 2025, kilometer: 0, nik_pemilik: '' },
  });

  useUnsavedChanges({ when: isDirty });

  const selectedModel = watch('jenis_mobil') || 'JAECOO J5 EV';
  const vehicleImage = getVehicleImageByModel(selectedModel);

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

    const localRecord: Vehicle = {
      ...payload,
      createdAt: new Date().toISOString(),
    };

    try {
      await createVehicleMutation.mutateAsync(payload);
      appendLocalEntity('vehicles', localRecord);
      showToast({ title: 'Kendaraan ditambahkan', description: 'Unit baru akan muncul pada daftar kendaraan.', tone: 'success' });
      navigate('/vehicles');
    } catch {
      appendLocalEntity('vehicles', localRecord);
      setSubmitState('Kendaraan disimpan ke mode lokal sambil menunggu backend aktif.');
      showToast({ title: 'Tersimpan di mode lokal', description: 'Flow tambah kendaraan tetap bisa diuji.', tone: 'info' });
      navigate('/vehicles');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Kendaraan" title="Tambah Kendaraan" />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <FormShell eyebrow="Form" title="Input Kendaraan Baru" subtitle="Masukkan data kendaraan lalu tampilkan pada list kendaraan utama.">
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
                {modelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
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
              <Button type="button" variant="secondary" onClick={async () => {
                if (!isDirty) {
                  navigate('/vehicles');
                  return;
                }
                const approved = await confirm({ title: 'Batalkan input kendaraan?', description: 'Perubahan yang belum disimpan akan hilang.' });
                if (approved) navigate('/vehicles');
              }}>Batal</Button>
              <Button type="button" variant="secondary" onClick={async () => {
                if (!isDirty) return reset();
                const approved = await confirm({ title: 'Reset form kendaraan?', description: 'Perubahan yang belum disimpan akan hilang.' });
                if (approved) reset();
              }}>Reset</Button>
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>
        <div className="space-y-4">
          <Card className="overflow-hidden p-0">
            <img src={vehicleImage.src} alt={vehicleImage.alt} className="h-52 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.28em] theme-muted">Preview</p>
              <h2 className="mt-3 text-2xl font-semibold theme-text">{selectedModel}</h2>
            </div>
          </Card>
          <PayloadPreview title="Payload Kendaraan" payload={lastPayload} />
        </div>
      </div>
    </div>
  );
}

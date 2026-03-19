import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select } from '@/common/components/ui/select';
import { Textarea } from '@/common/components/ui/textarea';
import { FormShell } from '@/common/components/forms/form-shell';
import { FormDirtyBanner } from '@/common/components/forms/form-dirty-banner';
import { FieldError, FieldHint, FieldLabel } from '@/common/components/forms/form-field';
import { PageHeader } from '@/common/components/page/page-header';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { useUnsavedChanges } from '@/common/hooks/use-unsaved-changes';
import { appendLocalEntity } from '@/common/lib/local-entity-store';
import { markWorkOrderCreated } from '@/common/lib/unseen-notifications';
import { useCreateWorkOrder } from '@/modules/work-orders/hooks/use-work-orders';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import type { CreateWorkOrderPayload } from '@/modules/work-orders/types/work-order.types';
import type { Customer, Service, Vehicle, WorkOrder } from '@/common/types/domain';

const schema = z.object({
  nomorWoPusat: z.string().min(3, 'Nomor work order pusat wajib diisi'),
  waktuMasuk: z.string().optional(),
  nik: z.string().min(8, 'NIK minimal 8 karakter'),
  nama: z.string().min(3, 'Nama pemilik minimal 3 karakter'),
  no_hp: z.string().optional(),
  alamat: z.string().optional(),
  plat_nomor: z.string().min(3, 'Plat nomor wajib diisi'),
  jenis_mobil: z.string().min(3, 'Model kendaraan wajib dipilih'),
  warna: z.string().optional(),
  no_rangka: z.string().min(5, 'Nomor rangka minimal 5 karakter'),
  kilometer: z.coerce.number().int().min(0, 'Kilometer tidak boleh negatif'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED']),
  statusServis: z.enum(['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'TERKENDALA']),
  prioritas: z.enum(['NORMAL', 'HIGH', 'URGENT']),
  keluhan: z.string().min(5, 'Keluhan minimal 5 karakter'),
  detailServis: z.string().optional(),
  estimasiSelesai: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const vehicleOptions = [
  'JAECOO J5 EV PREMIUM',
  'JAECOO J5 EV',
  'JAECOO J7 SHS-P',
  'JAECOO J7 AWD',
  'JAECOO J8 AWD',
  'JAECOO J8 ARDIS',
  'JAECOO J8 SHS-P ARDIS',
] as const;

export function WorkOrderCreatePage() {
  const navigate = useNavigate();
  const createWorkOrderMutation = useCreateWorkOrder();
  const creatorRole = useAuthStore((state) => state.user?.role);
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [submitState, setSubmitState] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomorWoPusat: '',
      waktuMasuk: '',
      nik: '',
      nama: '',
      no_hp: '',
      alamat: '',
      plat_nomor: '',
      jenis_mobil: 'JAECOO J5 EV PREMIUM',
      warna: '',
      no_rangka: '',
      kilometer: 0,
      status: 'OPEN',
      statusServis: 'ANTRIAN',
      prioritas: 'NORMAL',
      keluhan: '',
      detailServis: '',
      estimasiSelesai: '',
    },
  });

  useUnsavedChanges({ when: isDirty });

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateWorkOrderPayload & {
      customer: Customer;
      vehicle: Vehicle;
      detail_servis?: string[];
      nomor_wo_pusat?: string;
    } = {
      no_rangka: values.no_rangka,
      waktuMasuk: values.waktuMasuk || undefined,
      status: values.status,
      servis: {
        keluhan: values.keluhan,
        estimasiSelesai: values.estimasiSelesai || null,
        status: values.statusServis,
        prioritas: values.prioritas,
      },
      customer: {
        nik: values.nik,
        nama: values.nama,
        no_hp: values.no_hp || null,
        alamat: values.alamat || null,
        createdAt: new Date().toISOString(),
      },
      vehicle: {
        no_rangka: values.no_rangka,
        plat_nomor: values.plat_nomor,
        jenis_mobil: values.jenis_mobil,
        warna: values.warna || null,
        tahun: 2026,
        kilometer: values.kilometer,
        nik_pemilik: values.nik,
        createdAt: new Date().toISOString(),
      },
      detail_servis: values.detailServis ? values.detailServis.split('\n').map((item) => item.trim()).filter(Boolean) : [],
      nomor_wo_pusat: values.nomorWoPusat,
    };

    const now = new Date().toISOString();
    const workOrderId = Date.now();
    const localCustomer: Customer = payload.customer;
    const localVehicle: Vehicle = payload.vehicle;
    const localWorkOrder: WorkOrder = {
      id_wo: workOrderId,
      nomor_wo_pusat: values.nomorWoPusat,
      waktuMasuk: values.waktuMasuk || now,
      status: values.status,
      no_rangka: values.no_rangka,
    };
    const localService: Service = {
      id_servis: workOrderId + 1,
      id_wo: workOrderId,
      keluhan: `${values.nomorWoPusat} • ${values.keluhan}`,
      estimasiSelesai: values.estimasiSelesai || null,
      status: values.statusServis,
      prioritas: values.prioritas,
      createdAt: now,
    };

    try {
      await createWorkOrderMutation.mutateAsync(payload);
      appendLocalEntity('customers', localCustomer);
      appendLocalEntity('vehicles', localVehicle);
      appendLocalEntity('work-orders', localWorkOrder);
      appendLocalEntity('services', localService);
      markWorkOrderCreated(workOrderId, creatorRole);
      setSubmitState('Work order berhasil dikirim dan disebarkan ke dashboard lain.');
      showToast({
        title: 'Work order baru',
        description: 'Data work order pusat, pemilik, dan kendaraan berhasil ditambahkan.',
        tone: 'success',
      });
      navigate('/work-orders');
    } catch {
      appendLocalEntity('customers', localCustomer);
      appendLocalEntity('vehicles', localVehicle);
      appendLocalEntity('work-orders', localWorkOrder);
      appendLocalEntity('services', localService);
      markWorkOrderCreated(workOrderId, creatorRole);
      setSubmitState('Work order tersimpan ke mode lokal sambil menunggu backend aktif.');
      showToast({
        title: 'Mode lokal aktif',
        description: 'Data tetap disebarkan ke dashboard dan board servis untuk validasi alur.',
        tone: 'info',
      });
      navigate('/work-orders');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Work Order" title="Work Order Baru" />

      <FormShell
        eyebrow="Form Terpadu"
        title="Input Work Order"
        subtitle="Isi seluruh data work order pusat, pemilik, dan kendaraan dalam satu laman sesuai dokumen pusat."
      >
        <FormDirtyBanner visible={isDirty} />
        <form className="mt-4 space-y-6" onSubmit={onSubmit}>
          <section className="space-y-4 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel-light)]/40 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] theme-muted">Work Order Pusat</p>
              <h3 className="mt-2 text-xl font-semibold theme-text">Nomor WO, status, prioritas, dan detail servis</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="nomorWoPusat">Nomor Work Order Pusat</FieldLabel>
                <Input id="nomorWoPusat" placeholder="GW-DSB-26030008" {...register('nomorWoPusat')} />
                <FieldError>{errors.nomorWoPusat?.message}</FieldError>
              </div>
              <div>
                <FieldLabel htmlFor="waktuMasuk">Tanggal / Waktu Input</FieldLabel>
                <Input id="waktuMasuk" type="datetime-local" {...register('waktuMasuk')} />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel-light)]/40 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] theme-muted">Pemilik</p>
              <h3 className="mt-2 text-xl font-semibold theme-text">Data pelanggan / pemilik kendaraan</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="nik">NIK Pemilik</FieldLabel>
                <Input id="nik" placeholder="3301224406790004" {...register('nik')} />
                <FieldError>{errors.nik?.message}</FieldError>
              </div>
              <div>
                <FieldLabel htmlFor="nama">Nama Pemilik</FieldLabel>
                <Input id="nama" placeholder="Yunita Sabariah" {...register('nama')} />
                <FieldError>{errors.nama?.message}</FieldError>
              </div>
              <div>
                <FieldLabel htmlFor="no_hp">No HP</FieldLabel>
                <Input id="no_hp" placeholder="081392937597" {...register('no_hp')} />
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="alamat">Alamat</FieldLabel>
                <Textarea id="alamat" placeholder="Perum. Paradise Blok Y 6, Jatirjo" {...register('alamat')} />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel-light)]/40 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] theme-muted">Kendaraan</p>
              <h3 className="mt-2 text-xl font-semibold theme-text">Identitas kendaraan pelanggan</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="plat_nomor">Plat Nomor</FieldLabel>
                <Input id="plat_nomor" placeholder="AB1257Y" {...register('plat_nomor')} />
                <FieldError>{errors.plat_nomor?.message}</FieldError>
              </div>
              <div>
                <FieldLabel htmlFor="jenis_mobil">Model Kendaraan</FieldLabel>
                <Select id="jenis_mobil" {...register('jenis_mobil')}>
                  {vehicleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <FieldError>{errors.jenis_mobil?.message}</FieldError>
              </div>
              <div>
                <FieldLabel htmlFor="warna">Warna</FieldLabel>
                <Input id="warna" placeholder="Pristine White" {...register('warna')} />
              </div>
              <div>
                <FieldLabel htmlFor="no_rangka">No Rangka / VIN</FieldLabel>
                <Input id="no_rangka" placeholder="MF7HD27B8SJ000180" {...register('no_rangka')} />
                <FieldError>{errors.no_rangka?.message}</FieldError>
              </div>
              <div>
                <FieldLabel htmlFor="kilometer">Kilometer</FieldLabel>
                <Input id="kilometer" type="number" placeholder="6831" {...register('kilometer')} />
                <FieldError>{errors.kilometer?.message}</FieldError>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel-light)]/40 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] theme-muted">Detail Work Order</p>
              <h3 className="mt-2 text-xl font-semibold theme-text">Keluhan, servis, dan status distribusi</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="status">Status Work Order</FieldLabel>
                <Select id="status" {...register('status')}>
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="statusServis">Status Servis Awal</FieldLabel>
                <Select id="statusServis" {...register('statusServis')}>
                  <option value="ANTRIAN">ANTRIAN</option>
                  <option value="DIKERJAKAN">PROSES SERVIS</option>
                  <option value="TEST_DRIVE">SIAP TEST DRIVE</option>
                  <option value="SELESAI">SELESAI</option>
                  <option value="TERKENDALA">TERKENDALA</option>
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="prioritas">Prioritas</FieldLabel>
                <Select id="prioritas" {...register('prioritas')}>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="estimasiSelesai">Estimasi Selesai</FieldLabel>
                <Input id="estimasiSelesai" type="datetime-local" {...register('estimasiSelesai')} />
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="keluhan">Keluhan / Ringkasan Pekerjaan</FieldLabel>
                <Textarea id="keluhan" placeholder="PENGGANTIAN SHOCK ABS FR ALL (1Q)" {...register('keluhan')} />
                <FieldError>{errors.keluhan?.message}</FieldError>
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="detailServis">Detail Servis</FieldLabel>
                <Textarea id="detailServis" placeholder={`Spooring\nPenggantian shock ABS FR ALL (1Q)`} {...register('detailServis')} />
                <FieldHint>Satu baris satu item pekerjaan.</FieldHint>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  if (!isDirty) {
                    navigate('/work-orders');
                    return;
                  }
                  const approved = await confirm({
                    title: 'Batalkan flow work order?',
                    description: 'Perubahan yang belum disimpan akan hilang.',
                  });
                  if (approved) navigate('/work-orders');
                }}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  if (!isDirty) {
                    reset();
                    return;
                  }
                  const approved = await confirm({
                    title: 'Reset seluruh form?',
                    description: 'Semua data work order, pemilik, dan kendaraan akan dikosongkan.',
                  });
                  if (approved) reset();
                }}
              >
                Reset
              </Button>
            </div>
            <Button type="submit" disabled={isSubmitting || createWorkOrderMutation.isPending}>
              Simpan & Sebarkan Work Order
            </Button>
          </div>
        </form>
      </FormShell>

      {submitState ? (
        <p className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--panel-light)] px-4 py-3 text-sm theme-muted">
          {submitState}
        </p>
      ) : null}
    </div>
  );
}

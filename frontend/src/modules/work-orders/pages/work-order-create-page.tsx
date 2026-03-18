import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Card } from '@/common/components/ui/card';
import { Select } from '@/common/components/ui/select';
import { Textarea } from '@/common/components/ui/textarea';
import { FieldError, FieldHint, FieldLabel } from '@/common/components/forms/form-field';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { useCreateWorkOrder } from '@/modules/work-orders/hooks/use-work-orders';
import { type CreateWorkOrderPayload } from '@/modules/work-orders/types/work-order.types';

const schema = z.object({
  no_rangka: z.string().min(5, 'Nomor rangka minimal 5 karakter'),
  waktuMasuk: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED']),
  keluhan: z.string().min(5, 'Keluhan minimal 5 karakter'),
  estimasiSelesai: z.string().optional(),
  statusServis: z.enum(['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA']),
  prioritas: z.enum(['NORMAL', 'HIGH', 'URGENT']),
  detailServis: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function WorkOrderCreatePage() {
  const [lastPayload, setLastPayload] = useState<Record<string, unknown>>();
  const [submitState, setSubmitState] = useState<string>();
  const createWorkOrderMutation = useCreateWorkOrder();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'OPEN', statusServis: 'ANTRIAN', prioritas: 'NORMAL', no_rangka: '', keluhan: '', detailServis: '' },
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
      <Card>
        <p className="text-xs uppercase tracking-[0.28em] theme-muted">Work Order</p>
        <h1 className="mt-4 text-3xl font-semibold">Buat Work Order</h1>
        <p className="mt-3 text-sm theme-muted">Payload sudah disusun agar siap dikirim ke work order dan servis awal.</p>
      </Card>

      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(async (values) => {
          const payload: CreateWorkOrderPayload & { detail_servis?: string[] } = {
            no_rangka: values.no_rangka,
            waktuMasuk: values.waktuMasuk || undefined,
            status: values.status,
            servis: {
              keluhan: values.keluhan,
              estimasiSelesai: values.estimasiSelesai || null,
              status: values.statusServis,
              prioritas: values.prioritas,
            },
            detail_servis: values.detailServis
              ? values.detailServis.split('\n').map((item) => item.trim()).filter(Boolean)
              : [],
          };
          setLastPayload(payload);

          try {
            await createWorkOrderMutation.mutateAsync(payload);
            setSubmitState('Payload work order berhasil dikirim.');
            reset();
          } catch {
            setSubmitState('Payload work order siap integrasi. Endpoint backend belum merespons.');
          }
        })}>
          <div>
            <FieldLabel htmlFor="no_rangka">No Rangka</FieldLabel>
            <Input id="no_rangka" placeholder="MHCJAECOOJ7YOGYA01" {...register('no_rangka')} />
            <FieldError>{errors.no_rangka?.message}</FieldError>
          </div>
          <div>
            <FieldLabel htmlFor="waktuMasuk">Waktu Masuk</FieldLabel>
            <Input id="waktuMasuk" type="datetime-local" {...register('waktuMasuk')} />
          </div>
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
            <FieldLabel htmlFor="prioritas">Prioritas Servis</FieldLabel>
            <Select id="prioritas" {...register('prioritas')}>
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <FieldLabel htmlFor="keluhan">Keluhan</FieldLabel>
            <Textarea id="keluhan" placeholder="Mesin bergetar saat idle" {...register('keluhan')} />
            <FieldError>{errors.keluhan?.message}</FieldError>
          </div>
          <div>
            <FieldLabel htmlFor="estimasiSelesai">Estimasi Selesai</FieldLabel>
            <Input id="estimasiSelesai" type="datetime-local" {...register('estimasiSelesai')} />
          </div>
          <div>
            <FieldLabel htmlFor="statusServis">Status Servis Awal</FieldLabel>
            <Select id="statusServis" {...register('statusServis')}>
              <option value="ANTRIAN">ANTRIAN</option>
              <option value="DIKERJAKAN">DIKERJAKAN</option>
              <option value="TEST_DRIVE">TEST_DRIVE</option>
              <option value="SELESAI">SELESAI</option>
              <option value="DIAMBIL">DIAMBIL</option>
              <option value="TERKENDALA">TERKENDALA</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <FieldLabel htmlFor="detailServis">Detail Servis</FieldLabel>
            <Textarea id="detailServis" placeholder={['Ganti oli mesin', 'Cek rem depan', 'Road test'].join('\n')} {...register('detailServis')} />
            <FieldHint>Satu baris satu item pekerjaan. Data ini siap dipetakan ke detail_servis.</FieldHint>
          </div>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" className="mt-2" disabled={isSubmitting || createWorkOrderMutation.isPending}>Simpan Work Order</Button>
            {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
          </div>
        </form>
      </Card>

      <div className="xl:col-span-2">
        <PayloadPreview title="Payload Work Order" payload={lastPayload} />
      </div>
    </div>
  );
}

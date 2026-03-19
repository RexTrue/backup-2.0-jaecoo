import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select } from '@/common/components/ui/select';
import { Textarea } from '@/common/components/ui/textarea';
import { FieldError, FieldHint, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { FormDirtyBanner } from '@/common/components/forms/form-dirty-banner';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { PageHeader } from '@/common/components/page/page-header';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { useUnsavedChanges } from '@/common/hooks/use-unsaved-changes';
import { appendLocalEntity } from '@/common/lib/local-entity-store';
import { useCreateService } from '@/modules/services/hooks/use-services';
import type { Service } from '@/common/types/domain';
import type { CreateServicePayload } from '@/modules/services/types/service.types';

const schema = z.object({
  id_wo: z.coerce.number().int().min(1, 'Nomor work order wajib diisi'),
  keluhan: z.string().min(5, 'Keluhan minimal 5 karakter'),
  estimasiSelesai: z.string().optional(),
  status: z.enum(['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA']),
  prioritas: z.enum(['NORMAL', 'HIGH', 'URGENT']),
});

type FormValues = z.infer<typeof schema>;

export function ServiceCreatePage() {
  const [lastPayload, setLastPayload] = useState<CreateServicePayload>();
  const [submitState, setSubmitState] = useState<string>();
  const navigate = useNavigate();
  const createServiceMutation = useCreateService();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { id_wo: 101, keluhan: '', status: 'ANTRIAN', prioritas: 'NORMAL', estimasiSelesai: '' },
  });

  useUnsavedChanges({ when: isDirty });

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateServicePayload = {
      id_wo: values.id_wo,
      keluhan: values.keluhan,
      estimasiSelesai: values.estimasiSelesai || null,
      status: values.status,
      prioritas: values.prioritas,
    };
    setLastPayload(payload);

    const localRecord: Service = {
      id_servis: Date.now(),
      id_wo: payload.id_wo,
      keluhan: payload.keluhan,
      estimasiSelesai: payload.estimasiSelesai,
      status: payload.status ?? 'ANTRIAN',
      prioritas: payload.prioritas ?? 'NORMAL',
      createdAt: new Date().toISOString(),
    };

    try {
      await createServiceMutation.mutateAsync(payload);
      appendLocalEntity('services', localRecord);
      showToast({ title: 'Servis ditambahkan', description: 'Servis baru akan muncul pada kolom status yang sesuai.', tone: 'success' });
      navigate('/services');
    } catch {
      appendLocalEntity('services', localRecord);
      setSubmitState('Servis disimpan ke mode lokal sambil menunggu backend aktif.');
      showToast({ title: 'Tersimpan di mode lokal', description: 'Card servis baru tetap ditampilkan di board.', tone: 'info' });
      navigate('/services');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Servis" title="Tambah Servis Baru" />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <FormShell eyebrow="Form" title="Input Servis" subtitle="Status awal menentukan kolom board tempat card servis ditampilkan.">
          <FormDirtyBanner visible={isDirty} />
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div>
              <FieldLabel htmlFor="id_wo">Nomor Work Order</FieldLabel>
              <Input id="id_wo" type="number" {...register('id_wo')} />
              <FieldError>{errors.id_wo?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="prioritas">Prioritas</FieldLabel>
              <Select id="prioritas" {...register('prioritas')}>
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="keluhan">Keluhan / Pekerjaan</FieldLabel>
              <Textarea id="keluhan" placeholder="Cek rem depan, balancing, dan road test akhir" {...register('keluhan')} />
              <FieldError>{errors.keluhan?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="status">Status Awal</FieldLabel>
              <Select id="status" {...register('status')}>
                <option value="ANTRIAN">ANTRIAN</option>
                <option value="DIKERJAKAN">PROSES SERVIS</option>
                <option value="TEST_DRIVE">SIAP TEST DRIVE</option>
                <option value="SELESAI">SELESAI</option>
                <option value="DIAMBIL">DIAMBIL</option>
                <option value="TERKENDALA">TERKENDALA</option>
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="estimasiSelesai">Estimasi Selesai</FieldLabel>
              <Input id="estimasiSelesai" type="datetime-local" {...register('estimasiSelesai')} />
              <FieldHint>Opsional. Dipakai untuk pengelolaan operasional dan timeline servis.</FieldHint>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isSubmitting || createServiceMutation.isPending}>Simpan Servis</Button>
              <Button type="button" variant="secondary" onClick={async () => {
                if (!isDirty) {
                  navigate('/services');
                  return;
                }
                const approved = await confirm({ title: 'Batalkan input servis?', description: 'Perubahan yang belum disimpan akan hilang.' });
                if (approved) navigate('/services');
              }}>Batal</Button>
              <Button type="button" variant="secondary" onClick={async () => {
                if (!isDirty) return reset();
                const approved = await confirm({ title: 'Reset form servis?', description: 'Perubahan yang belum disimpan akan hilang.' });
                if (approved) reset();
              }}>Reset</Button>
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>
        <PayloadPreview title="Payload Servis" payload={lastPayload} />
      </div>
    </div>
  );
}

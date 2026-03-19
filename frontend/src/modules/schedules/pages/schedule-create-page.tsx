import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Button } from '@/common/components/ui/button';
import { FieldError, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { FormDirtyBanner } from '@/common/components/forms/form-dirty-banner';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { PageHeader } from '@/common/components/page/page-header';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { useUnsavedChanges } from '@/common/hooks/use-unsaved-changes';
import { appendLocalEntity } from '@/common/lib/local-entity-store';
import { useCreateSchedule } from '@/modules/schedules/hooks/use-schedules';
import type { CreateSchedulePayload } from '@/modules/schedules/services/schedule-api';

const schema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  jam_mulai: z.string().min(1, 'Jam mulai wajib diisi'),
  jam_selesai: z.string().min(1, 'Jam selesai wajib diisi'),
  nik: z.string().min(8, 'NIK minimal 8 karakter'),
  no_rangka: z.string().min(5, 'Nomor rangka minimal 5 karakter'),
  keluhan: z.string().min(5, 'Keluhan minimal 5 karakter'),
  catatan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ScheduleCreatePage() {
  const [lastPayload, setLastPayload] = useState<CreateSchedulePayload>();
  const [submitState, setSubmitState] = useState<string>();
  const navigate = useNavigate();
  const createScheduleMutation = useCreateSchedule();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useUnsavedChanges({ when: isDirty });

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateSchedulePayload = {
      tanggal: values.tanggal,
      jam_mulai: values.jam_mulai,
      jam_selesai: values.jam_selesai,
      nik: values.nik,
      no_rangka: values.no_rangka,
      keluhan: values.keluhan,
      catatan: values.catatan || null,
    };
    setLastPayload(payload);

    try {
      await createScheduleMutation.mutateAsync(payload);
      appendLocalEntity('schedules', payload);
      showToast({ title: 'Jadwal ditambahkan', description: 'Booking baru akan muncul pada daftar jadwal.', tone: 'success' });
      navigate('/schedules');
    } catch {
      appendLocalEntity('schedules', payload);
      setSubmitState('Jadwal disimpan ke mode lokal sambil menunggu backend aktif.');
      showToast({ title: 'Tersimpan di mode lokal', description: 'Booking tetap dimasukkan ke daftar jadwal.', tone: 'info' });
      navigate('/schedules');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Jadwal" title="Tambah Jadwal" />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <FormShell eyebrow="Form" title="Booking Jadwal" subtitle="Pisahkan daftar jadwal dan form booking agar operasional lebih fokus.">
          <FormDirtyBanner visible={isDirty} />
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div>
              <FieldLabel htmlFor="tanggal">Tanggal</FieldLabel>
              <Input id="tanggal" type="date" {...register('tanggal')} />
              <FieldError>{errors.tanggal?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="nik">NIK</FieldLabel>
              <Input id="nik" placeholder="3401123456780001" {...register('nik')} />
              <FieldError>{errors.nik?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="jam_mulai">Jam Mulai</FieldLabel>
              <Input id="jam_mulai" type="time" {...register('jam_mulai')} />
              <FieldError>{errors.jam_mulai?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="jam_selesai">Jam Selesai</FieldLabel>
              <Input id="jam_selesai" type="time" {...register('jam_selesai')} />
              <FieldError>{errors.jam_selesai?.message}</FieldError>
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="no_rangka">No Rangka</FieldLabel>
              <Input id="no_rangka" placeholder="MHCJAECOOJ7YOGYA01" {...register('no_rangka')} />
              <FieldError>{errors.no_rangka?.message}</FieldError>
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="keluhan">Keluhan</FieldLabel>
              <Textarea id="keluhan" placeholder="Cek rem dan getaran mesin" {...register('keluhan')} />
              <FieldError>{errors.keluhan?.message}</FieldError>
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="catatan">Catatan</FieldLabel>
              <Textarea id="catatan" placeholder="Catatan tambahan" {...register('catatan')} />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isSubmitting || createScheduleMutation.isPending}>Simpan Jadwal</Button>
              <Button type="button" variant="secondary" onClick={async () => {
                if (!isDirty) {
                  navigate('/schedules');
                  return;
                }
                const approved = await confirm({ title: 'Batalkan input jadwal?', description: 'Perubahan yang belum disimpan akan hilang.' });
                if (approved) navigate('/schedules');
              }}>Batal</Button>
              <Button type="button" variant="secondary" onClick={async () => {
                if (!isDirty) return reset();
                const approved = await confirm({ title: 'Reset form jadwal?', description: 'Perubahan yang belum disimpan akan hilang.' });
                if (approved) reset();
              }}>Reset</Button>
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>
        <PayloadPreview title="Payload Jadwal" payload={lastPayload} />
      </div>
    </div>
  );
}

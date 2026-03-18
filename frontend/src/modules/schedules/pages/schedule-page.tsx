import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Button } from '@/common/components/ui/button';
import { FieldError, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { PageHeader } from '@/common/components/page/page-header';
import { useCreateSchedule } from '@/modules/schedules/hooks/use-schedules';
import type { CreateSchedulePayload } from '@/modules/schedules/services/schedule-api';
import { dailyPlanMock } from '@/modules/schedules/mocks/schedule.mock';

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

export function SchedulePage() {
  const [lastPayload, setLastPayload] = useState<CreateSchedulePayload>();
  const [submitState, setSubmitState] = useState<string>();
  const createScheduleMutation = useCreateSchedule();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

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
      setSubmitState('Payload jadwal berhasil dikirim.');
      reset();
    } catch {
      setSubmitState('Payload jadwal siap integrasi. Endpoint backend belum merespons.');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Jadwal" title="Jadwal" />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <FormShell eyebrow="Form" title="Booking Jadwal" subtitle="Disiapkan untuk kebutuhan penjadwalan servis.">
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
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>

        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-1">
            {dailyPlanMock.map((item) => (
              <Card key={item.slot}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm theme-muted">{item.slot}</p>
                    <p className="mt-3 text-4xl font-semibold">{item.capacity}</p>
                    <p className="mt-4 text-sm theme-muted">{item.note}</p>
                  </div>
                  <div className="action-strip">
                    <Button variant="secondary" type="button">Edit</Button>
                    <Button variant="danger" type="button">Hapus</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <PayloadPreview title="Payload Jadwal" payload={lastPayload} />
        </div>
      </div>
    </div>
  );
}

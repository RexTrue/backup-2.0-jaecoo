import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select } from '@/common/components/ui/select';
import { FieldError, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { PageHeader } from '@/common/components/page/page-header';
import { useRequestReport } from '@/modules/reports/hooks/use-reports';
import type { ReportFilterPayload } from '@/modules/reports/services/report-api';

const schema = z.object({
  tanggal_mulai: z.string().min(1, 'Tanggal mulai wajib diisi'),
  tanggal_selesai: z.string().min(1, 'Tanggal selesai wajib diisi'),
  status: z.string().optional(),
  role: z.string().optional(),
  format: z.enum(['PDF', 'CSV', 'XLSX']),
});

type FormValues = z.infer<typeof schema>;

export function ReportPage() {
  const [lastPayload, setLastPayload] = useState<ReportFilterPayload>();
  const [submitState, setSubmitState] = useState<string>();
  const requestReportMutation = useRequestReport();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { format: 'PDF', status: '', role: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload: ReportFilterPayload = {
      tanggal_mulai: values.tanggal_mulai,
      tanggal_selesai: values.tanggal_selesai,
      status: values.status || null,
      role: values.role || null,
      format: values.format,
    };
    setLastPayload(payload);
    try {
      await requestReportMutation.mutateAsync(payload);
      setSubmitState('Permintaan laporan berhasil dikirim.');
    } catch {
      setSubmitState('Payload laporan siap integrasi. Endpoint backend belum merespons.');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Laporan" title="Laporan" />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <FormShell eyebrow="Form" title="Filter Laporan">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div>
              <FieldLabel htmlFor="tanggal_mulai">Tanggal Mulai</FieldLabel>
              <Input id="tanggal_mulai" type="date" {...register('tanggal_mulai')} />
              <FieldError>{errors.tanggal_mulai?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="tanggal_selesai">Tanggal Selesai</FieldLabel>
              <Input id="tanggal_selesai" type="date" {...register('tanggal_selesai')} />
              <FieldError>{errors.tanggal_selesai?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="status">Status Servis</FieldLabel>
              <Select id="status" {...register('status')}>
                <option value="">Semua</option>
                <option value="ANTRIAN">ANTRIAN</option>
                <option value="DIKERJAKAN">DIKERJAKAN</option>
                <option value="TEST_DRIVE">TEST_DRIVE</option>
                <option value="SELESAI">SELESAI</option>
                <option value="DIAMBIL">DIAMBIL</option>
                <option value="TERKENDALA">TERKENDALA</option>
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select id="role" {...register('role')}>
                <option value="">Semua</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="FRONTLINE">FRONTLINE</option>
                <option value="MEKANIK">MEKANIK</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="format">Format</FieldLabel>
              <Select id="format" {...register('format')}>
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
                <option value="XLSX">XLSX</option>
              </Select>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isSubmitting || requestReportMutation.isPending}>Generate Laporan</Button>
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>

        <Card>
          <h2 className="text-xl font-semibold theme-text">Status Laporan</h2>
          <p className="mt-4 text-sm leading-6 theme-muted">{submitState ?? 'Belum ada proses generate laporan. Catatan: Setelah backend siap, status pemrosesan akan ditampilkan di sini. Saat ini halaman laporan difokuskan untuk menyiapkan filter dan payload yang konsisten.'}</p>
          {lastPayload ? <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[color:var(--text)]/72">Filter laporan sudah siap digunakan untuk integrasi backend.</p> : null}
        </Card>
      </div>
    </div>
  );
}

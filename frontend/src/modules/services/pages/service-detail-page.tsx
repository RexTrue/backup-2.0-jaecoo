import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/common/components/ui/card';
import { ErrorState } from '@/common/components/feedback/error-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select } from '@/common/components/ui/select';
import { Textarea } from '@/common/components/ui/textarea';
import { StatusBadge } from '@/common/components/data-display/status-badge';
import { InfoPanel } from '@/common/components/data-display/info-panel';
import { PropertyList } from '@/common/components/data-display/property-list';
import { PageHeader } from '@/common/components/page/page-header';
import { FieldError, FieldLabel } from '@/common/components/forms/form-field';
import { FormDirtyBanner } from '@/common/components/forms/form-dirty-banner';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { PermissionGate } from '@/common/components/auth/permission-gate';
import { shouldUseMockFallback } from '@/common/lib/query-fallback';
import { useUnsavedChanges } from '@/common/hooks/use-unsaved-changes';
import { ServiceTimeline } from '@/modules/services/components/service-timeline';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { roleLabels } from '@/common/lib/authz';
import { serviceDetailMock } from '@/modules/services/mocks/service.mock';
import { useCreateMechanicNote, useCreateService, useServiceDetail, useUpdateServiceStatus } from '@/modules/services/hooks/use-services';

const serviceSchema = z.object({
  id_wo: z.coerce.number().int().min(1),
  keluhan: z.string().min(5),
  estimasiSelesai: z.string().optional(),
  status: z.enum(['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA']),
  prioritas: z.enum(['NORMAL', 'HIGH', 'URGENT']),
});

const statusSchema = z.object({
  status: z.enum(['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA']),
});

const noteSchema = z.object({
  catatan: z.string().min(3, 'Catatan minimal 3 karakter'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

type StatusFormValues = z.infer<typeof statusSchema>;

type NoteFormValues = z.infer<typeof noteSchema>;

export function ServiceDetailPage() {
  const { serviceId = '10' } = useParams();
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? 'ADMIN';
  const [servicePayload, setServicePayload] = useState<Record<string, unknown>>();
  const [statusPayload, setStatusPayload] = useState<Record<string, unknown>>();
  const [notePayload, setNotePayload] = useState<Record<string, unknown>>();
  const [feedback, setFeedback] = useState<string>();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const serviceDetailQuery = useServiceDetail(serviceId);
  const useMockData = shouldUseMockFallback(serviceDetailQuery.isError);
  const service = serviceDetailQuery.data ?? (useMockData ? serviceDetailMock : undefined);
  const createServiceMutation = useCreateService();
  const updateStatusMutation = useUpdateServiceStatus(serviceId);
  const createNoteMutation = useCreateMechanicNote(serviceId);

  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { id_wo: service?.id_wo ?? 101, keluhan: service?.keluhan ?? 'Mesin bergetar saat idle', status: service?.status ?? 'DIKERJAKAN', prioritas: service?.prioritas ?? 'NORMAL' },
  });
  const statusForm = useForm<StatusFormValues>({ resolver: zodResolver(statusSchema), defaultValues: { status: service?.status ?? 'TEST_DRIVE' } });
  const noteForm = useForm<NoteFormValues>({ resolver: zodResolver(noteSchema) });

  useUnsavedChanges({ when: serviceForm.formState.isDirty || statusForm.formState.isDirty || noteForm.formState.isDirty });

  const timelineItems = useMemo(() => (service?.riwayat?.length ? service.riwayat : []), [service]);
  const activeStatus = service?.status ?? 'DIKERJAKAN';
  const workOrderLabel = service?.id_wo ? `WO #${service.id_wo}` : 'WO #101';
  const complaint = service?.keluhan ?? 'Mesin bergetar saat idle. Cek mounting mesin, throttle body, dan road test.';
  const estimationLabel = service?.estimasiSelesai ? new Date(service.estimasiSelesai).toLocaleString('id-ID') : '16.00 WIB';

  return (
    <div className="space-y-5">
      {serviceDetailQuery.isLoading ? <LoadingState message="Memuat detail servis..." rows={2} /> : null}
      {useMockData ? (
        <ErrorState message="Detail servis backend belum tersedia." description="Halaman tetap memakai data contoh agar interaksi form dan timeline tetap bisa diuji." />
      ) : null}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <PageHeader
            eyebrow={workOrderLabel}
            title="Servis"
            actions={(
              <>
                <StatusBadge status={activeStatus} />
                <PermissionGate permission="services:update">
                  <Button variant="secondary" type="button">Edit</Button>
                  <Button
                    variant="danger"
                    type="button"
                    onClick={async () => {
                      const approved = await confirm({ title: 'Hapus data servis?', description: 'Aksi hapus belum dihubungkan ke backend.', confirmLabel: 'Hapus', tone: 'danger' });
                      if (approved) showToast({ title: 'Aksi hapus dicatat', description: 'Endpoint delete servis belum diaktifkan.', tone: 'info' });
                    }}
                  >
                    Hapus
                  </Button>
                </PermissionGate>
              </>
            )}
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoPanel title="Kendaraan">
              <PropertyList
                items={[
                  { label: 'Plat', value: 'AB 1234 JQ' },
                  { label: 'No rangka', value: 'MHCJAECOOJ7YOGYA01' },
                  { label: 'Model', value: 'JAECOO J7 AWD' },
                  { label: 'Kilometer', value: '12.420 km' },
                ]}
              />
            </InfoPanel>
            <InfoPanel title="Pelanggan">
              <PropertyList
                items={[
                  { label: 'Nama', value: 'Budi Santoso' },
                  { label: 'No HP', value: '0812-3456-7890' },
                  { label: 'User', value: roleLabels[role] },
                  { label: 'Estimasi selesai', value: estimationLabel },
                ]}
              />
            </InfoPanel>
          </div>

          <InfoPanel title="Keluhan" className="mt-6 bg-[color:var(--panel)]">
            <p className="text-sm theme-muted">{complaint}</p>
          </InfoPanel>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Timeline</h2>
          <div className="mt-6">
            <ServiceTimeline items={timelineItems} />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Form</p>
          <h2 className="mt-3 text-2xl font-semibold">Input Servis</h2>
          <FormDirtyBanner visible={serviceForm.formState.isDirty} />
          <form className="mt-5 space-y-4" onSubmit={serviceForm.handleSubmit(async (values) => {
            const payload = { ...values, estimasiSelesai: values.estimasiSelesai || null };
            setServicePayload(payload);
            try {
              await createServiceMutation.mutateAsync(payload);
              setFeedback('Payload servis berhasil dikirim.');
              showToast({ title: 'Servis disimpan', description: 'Payload servis berhasil dikirim ke service layer.', tone: 'success' });
              serviceForm.reset(values);
            } catch {
              setFeedback('Payload servis siap integrasi. Endpoint backend belum merespons.');
              showToast({ title: 'Backend belum merespons', description: 'Payload servis tetap tersimpan di panel preview.', tone: 'info' });
            }
          })}>
            <div>
              <FieldLabel htmlFor="id_wo">ID Work Order</FieldLabel>
              <Input id="id_wo" type="number" {...serviceForm.register('id_wo')} />
            </div>
            <div>
              <FieldLabel htmlFor="keluhan">Keluhan</FieldLabel>
              <Textarea id="keluhan" {...serviceForm.register('keluhan')} />
              <FieldError>{serviceForm.formState.errors.keluhan?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="estimasiSelesai">Estimasi Selesai</FieldLabel>
              <Input id="estimasiSelesai" type="datetime-local" {...serviceForm.register('estimasiSelesai')} />
            </div>
            <div>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select id="status" {...serviceForm.register('status')}>
                <option value="ANTRIAN">ANTRIAN</option>
                <option value="DIKERJAKAN">DIKERJAKAN</option>
                <option value="TEST_DRIVE">TEST_DRIVE</option>
                <option value="SELESAI">SELESAI</option>
                <option value="DIAMBIL">DIAMBIL</option>
                <option value="TERKENDALA">TERKENDALA</option>
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="prioritas">Prioritas</FieldLabel>
              <Select id="prioritas" {...serviceForm.register('prioritas')}>
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </Select>
            </div>
            <PermissionGate permission="services:update">
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={createServiceMutation.isPending}>Simpan Servis</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    if (!serviceForm.formState.isDirty) return serviceForm.reset();
                    const approved = await confirm({ title: 'Reset form servis?', description: 'Perubahan yang belum disimpan akan hilang.' });
                    if (approved) {
                      serviceForm.reset();
                      showToast({ title: 'Form direset', description: 'Input servis kembali ke nilai awal.' });
                    }
                  }}
                >
                  Reset
                </Button>
              </div>
            </PermissionGate>
          </form>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Form</p>
          <h2 className="mt-3 text-2xl font-semibold">Update Status</h2>
          <FormDirtyBanner visible={statusForm.formState.isDirty || noteForm.formState.isDirty} />
          <form className="mt-5 space-y-4" onSubmit={statusForm.handleSubmit(async (values) => {
            setStatusPayload(values);
            try {
              await updateStatusMutation.mutateAsync(values);
              setFeedback('Status servis berhasil dikirim.');
              showToast({ title: 'Status diperbarui', description: 'Perubahan status servis berhasil dikirim.', tone: 'success' });
              statusForm.reset(values);
            } catch {
              setFeedback('Payload status siap integrasi. Endpoint backend belum merespons.');
              showToast({ title: 'Backend belum merespons', description: 'Payload status tetap tersimpan di panel preview.', tone: 'info' });
            }
          })}>
            <div>
              <FieldLabel htmlFor="status-update">Status Baru</FieldLabel>
              <Select id="status-update" {...statusForm.register('status')}>
                <option value="ANTRIAN">ANTRIAN</option>
                <option value="DIKERJAKAN">DIKERJAKAN</option>
                <option value="TEST_DRIVE">TEST_DRIVE</option>
                <option value="SELESAI">SELESAI</option>
                <option value="DIAMBIL">DIAMBIL</option>
                <option value="TERKENDALA">TERKENDALA</option>
              </Select>
            </div>
            <PermissionGate permission="services:update">
              <Button type="submit" disabled={updateStatusMutation.isPending}>Kirim Status</Button>
            </PermissionGate>
          </form>

          <div className="mt-8 border-t border-[color:var(--line)] pt-5">
            <p className="text-xs uppercase tracking-[0.28em] theme-muted">Form</p>
            <h2 className="mt-3 text-2xl font-semibold">Catatan Mekanik</h2>
            <form className="mt-5 space-y-4" onSubmit={noteForm.handleSubmit(async (values) => {
              setNotePayload(values);
              try {
                await createNoteMutation.mutateAsync(values);
                setFeedback('Catatan mekanik berhasil dikirim.');
                showToast({ title: 'Catatan disimpan', description: 'Catatan mekanik berhasil dikirim.', tone: 'success' });
                noteForm.reset();
              } catch {
                setFeedback('Payload catatan siap integrasi. Endpoint backend belum merespons.');
                showToast({ title: 'Backend belum merespons', description: 'Payload catatan tetap tersimpan di panel preview.', tone: 'info' });
              }
            })}>
              <div>
                <FieldLabel htmlFor="catatan">Catatan</FieldLabel>
                <Textarea id="catatan" placeholder="Temuan mekanik" {...noteForm.register('catatan')} />
                <FieldError>{noteForm.formState.errors.catatan?.message}</FieldError>
              </div>
              <PermissionGate permission="services:update">
                <Button type="submit" disabled={createNoteMutation.isPending}>Simpan Catatan</Button>
              </PermissionGate>
            </form>
          </div>
          {feedback ? <p className="mt-4 text-sm theme-muted">{feedback}</p> : null}
        </Card>

        <div className="space-y-5">
          <PayloadPreview title="Payload Servis" payload={servicePayload} />
          <PayloadPreview title="Payload Status" payload={statusPayload} />
          <PayloadPreview title="Payload Catatan" payload={notePayload} />
        </div>
      </div>
    </div>
  );
}

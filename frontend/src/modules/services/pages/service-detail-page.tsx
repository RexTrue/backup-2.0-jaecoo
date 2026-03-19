import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/common/components/ui/card';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { Button } from '@/common/components/ui/button';
import { Select } from '@/common/components/ui/select';
import { Textarea } from '@/common/components/ui/textarea';
import { StatusBadge } from '@/common/components/data-display/status-badge';
import { InfoPanel } from '@/common/components/data-display/info-panel';
import { PropertyList } from '@/common/components/data-display/property-list';
import { PageHeader } from '@/common/components/page/page-header';
import { FieldError, FieldLabel } from '@/common/components/forms/form-field';
import { FormDirtyBanner } from '@/common/components/forms/form-dirty-banner';
import { PermissionGate } from '@/common/components/auth/permission-gate';
import { useUnsavedChanges } from '@/common/hooks/use-unsaved-changes';
import { ServiceTimeline } from '@/modules/services/components/service-timeline';
import { useCreateMechanicNote, useServiceDetail, useUpdateServiceStatus } from '@/modules/services/hooks/use-services';
import { getLocalEntities } from '@/common/lib/local-entity-store';
import { formatWorkOrderCode } from '@/common/lib/work-order-code';
import { markItemsSeen, markServiceUpdated } from '@/common/lib/unseen-notifications';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import type { Customer, Service, Vehicle, WorkOrder } from '@/common/types/domain';

const statusSchema = z.object({
  status: z.enum(['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA']),
});

const noteSchema = z.object({
  catatan: z.string().min(3, 'Catatan minimal 3 karakter'),
});

type StatusFormValues = z.infer<typeof statusSchema>;
type NoteFormValues = z.infer<typeof noteSchema>;

const mechanicAllowedStatuses = ['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'TERKENDALA'] as const;
const managerAllowedStatuses = ['ANTRIAN', 'DIKERJAKAN', 'TEST_DRIVE', 'SELESAI', 'DIAMBIL', 'TERKENDALA'] as const;

export function ServiceDetailPage() {
  const { serviceId = '10' } = useParams();
  const role = useAuthStore((state) => state.user?.role);
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const serviceDetailQuery = useServiceDetail(serviceId);
  const updateStatusMutation = useUpdateServiceStatus(serviceId);
  const createNoteMutation = useCreateMechanicNote(serviceId);

  const localServices = useMemo(() => getLocalEntities<Service>('services'), []);
  const localWorkOrders = useMemo(() => getLocalEntities<WorkOrder>('work-orders'), []);
  const localVehicles = useMemo(() => getLocalEntities<Vehicle>('vehicles'), []);
  const localCustomers = useMemo(() => getLocalEntities<Customer>('customers'), []);

  const service = serviceDetailQuery.data ?? localServices.find((item) => String(item.id_servis) === serviceId);
  const linkedWorkOrder = useMemo(() => localWorkOrders.find((item) => item.id_wo === service?.id_wo), [localWorkOrders, service?.id_wo]);
  const linkedVehicle = useMemo(() => localVehicles.find((item) => item.no_rangka === linkedWorkOrder?.no_rangka), [linkedWorkOrder?.no_rangka, localVehicles]);
  const linkedCustomer = useMemo(() => localCustomers.find((item) => item.nik === linkedVehicle?.nik_pemilik), [linkedVehicle?.nik_pemilik, localCustomers]);

  const statusForm = useForm<StatusFormValues>({ resolver: zodResolver(statusSchema), defaultValues: { status: service?.status ?? 'ANTRIAN' } });
  const noteForm = useForm<NoteFormValues>({ resolver: zodResolver(noteSchema) });

  useUnsavedChanges({ when: statusForm.formState.isDirty || noteForm.formState.isDirty });

  const timelineItems = useMemo(() => (service?.riwayat?.length ? service.riwayat : []), [service]);
  const allowedStatuses = role === 'MEKANIK' ? mechanicAllowedStatuses : managerAllowedStatuses;
  const activeStatus = service?.status ?? 'ANTRIAN';
  const workOrderLabel = linkedWorkOrder ? formatWorkOrderCode(linkedWorkOrder) : 'WO belum terhubung';
  const complaint = service?.keluhan ?? 'Keluhan belum tersedia.';
  const estimationLabel = service?.estimasiSelesai ? new Date(service.estimasiSelesai).toLocaleString('id-ID') : '-';

  useEffect(() => {
    if (role && service?.id_wo) markItemsSeen(role, [service.id_wo]);
  }, [role, service?.id_wo]);

  if (serviceDetailQuery.isLoading && !service) {
    return <LoadingState message="Memuat detail servis..." rows={3} />;
  }

  if (!service) {
    return <EmptyState message="Detail servis belum tersedia." />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <PageHeader
            eyebrow={workOrderLabel}
            title="Servis"
            actions={(
              <>
                <StatusBadge status={activeStatus} />
                <PermissionGate permission="services:update">
                  <Button variant="secondary" type="button" disabled title="Aksi edit detail servis belum dihubungkan ke halaman lanjutan.">Edit (segera hadir)</Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={async () => {
                      const approved = await confirm({ title: 'Hapus data servis?', description: 'Aksi hapus belum dihubungkan ke backend.', confirmLabel: 'Catat aksi', tone: 'danger' });
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
                  { label: 'Plat', value: linkedVehicle?.plat_nomor ?? '-' },
                  { label: 'No rangka', value: linkedWorkOrder?.no_rangka ?? linkedVehicle?.no_rangka ?? '-' },
                  { label: 'Model', value: linkedVehicle?.jenis_mobil ?? '-' },
                  { label: 'Kilometer', value: linkedVehicle?.kilometer ? `${linkedVehicle.kilometer.toLocaleString('id-ID')} km` : '-' },
                ]}
              />
            </InfoPanel>
            <InfoPanel title="Pelanggan">
              <PropertyList
                items={[
                  { label: 'Nama', value: linkedCustomer?.nama ?? '-' },
                  { label: 'No HP', value: linkedCustomer?.no_hp ?? '-' },
                  { label: 'Alamat', value: linkedCustomer?.alamat ?? '-' },
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
            {timelineItems.length ? <ServiceTimeline items={timelineItems} /> : <EmptyState message="Belum ada riwayat perubahan status." />}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Form</p>
          <h2 className="mt-3 text-2xl font-semibold">Update Status</h2>
          <FormDirtyBanner visible={statusForm.formState.isDirty || noteForm.formState.isDirty} />
          <form className="mt-5 space-y-4" onSubmit={statusForm.handleSubmit(async (values) => {
            try {
              await updateStatusMutation.mutateAsync(values);
              markServiceUpdated(service.id_wo, role);
              showToast({ title: 'Status diperbarui', description: 'Perubahan status servis berhasil dikirim.', tone: 'success' });
              statusForm.reset(values);
            } catch {
              markServiceUpdated(service.id_wo, role);
              showToast({ title: 'Backend belum merespons', description: 'Perubahan status masih menunggu integrasi backend.', tone: 'info' });
            }
          })}>
            <div>
              <FieldLabel htmlFor="status-update">Status Baru</FieldLabel>
              <Select id="status-update" {...statusForm.register('status')}>
                {allowedStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </div>
            <PermissionGate permission="services:update">
              <Button type="submit" disabled={updateStatusMutation.isPending}>Kirim Status</Button>
            </PermissionGate>
          </form>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Form</p>
          <h2 className="mt-3 text-2xl font-semibold">Catatan Mekanik</h2>
          <form className="mt-5 space-y-4" onSubmit={noteForm.handleSubmit(async (values) => {
            try {
              await createNoteMutation.mutateAsync(values);
              markServiceUpdated(service.id_wo, role);
              showToast({ title: 'Catatan ditambahkan', description: 'Catatan mekanik berhasil dikirim ke service layer.', tone: 'success' });
              noteForm.reset();
            } catch {
              markServiceUpdated(service.id_wo, role);
              showToast({ title: 'Backend belum merespons', description: 'Catatan mekanik masih menunggu integrasi backend.', tone: 'info' });
            }
          })}>
            <div>
              <FieldLabel htmlFor="catatan">Catatan</FieldLabel>
              <Textarea id="catatan" {...noteForm.register('catatan')} />
              <FieldError>{noteForm.formState.errors.catatan?.message}</FieldError>
            </div>
            <PermissionGate permission="services:update">
              <Button type="submit" disabled={createNoteMutation.isPending}>Kirim Catatan</Button>
            </PermissionGate>
          </form>
        </Card>

      </div>
    </div>
  );
}

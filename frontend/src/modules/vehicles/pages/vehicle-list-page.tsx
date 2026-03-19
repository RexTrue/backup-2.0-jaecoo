import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { ErrorState } from '@/common/components/feedback/error-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { Button } from '@/common/components/ui/button';
import { ListCard } from '@/common/components/data-display/list-card';
import { PageHeader } from '@/common/components/page/page-header';
import { PermissionGate } from '@/common/components/auth/permission-gate';
import { shouldUseMockFallback } from '@/common/lib/query-fallback';
import { vehicleRowsMock } from '@/modules/vehicles/mocks/vehicle.mock';
import { useVehicles } from '@/modules/vehicles/hooks/use-vehicles';
import { mapVehicleToListRow } from '@/modules/vehicles/mappers/vehicle-mappers';
import type { VehicleListRow } from '@/modules/vehicles/types/vehicle.types';
import type { Vehicle } from '@/common/types/domain';
import { getLocalEntities } from '@/common/lib/local-entity-store';

function VehicleListItem({ row, onDelete }: { row: VehicleListRow; onDelete: () => void }) {
  return (
    <ListCard
      key={row.plate}
      title={(
        <div className="flex items-center gap-4">
          <div className="h-16 w-24 overflow-hidden rounded-[18px] border border-[color:var(--line)] bg-[color:var(--panel)]">
            <img src={row.imageSrc} alt={row.imageAlt} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-base font-semibold theme-text">{row.unit}</p>
            <p className="mt-1 text-xs theme-muted">{row.plate} · Warna {row.color}</p>
          </div>
        </div>
      )}
      meta={<div className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-1 text-xs theme-muted">{row.km}</div>}
      footer={(
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm theme-muted">Identifikasi cepat model kendaraan dengan thumbnail visual.</p>
          <PermissionGate permission="vehicles:view">
            <div className="action-strip">
              <Button variant="secondary" type="button">Edit</Button>
              <Button variant="danger" type="button" onClick={onDelete}>Hapus</Button>
            </div>
          </PermissionGate>
        </div>
      )}
    />
  );
}

export function VehicleListPage() {
  const vehiclesQuery = useVehicles();
  const vehicles = vehiclesQuery.data;
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const rows = useMemo(() => (vehicles?.length ? vehicles.map(mapVehicleToListRow) : []), [vehicles]);
  const localRows = useMemo(() => getLocalEntities<Vehicle>('vehicles').map(mapVehicleToListRow), []);
  const useMockData = shouldUseMockFallback(vehiclesQuery.isError);

  const displayRows: VehicleListRow[] = useMemo(() => {
    const base = useMockData ? vehicleRowsMock : rows;
    const deduped = [...localRows, ...base];
    return deduped.filter((item, index) => deduped.findIndex((candidate) => candidate.plate === item.plate) === index);
  }, [localRows, rows, useMockData]);

  const handleDelete = async (plate: string) => {
    const approved = await confirm({
      title: `Hapus kendaraan ${plate}?`,
      description: 'Aksi ini akan dihubungkan ke endpoint kendaraan pada tahap backend.',
      confirmLabel: 'Hapus',
      tone: 'danger',
    });
    if (approved) showToast({ title: 'Aksi hapus dicatat', description: 'Endpoint delete kendaraan belum diaktifkan.', tone: 'info' });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Kendaraan"
        title="Kendaraan"
        actions={(
          <PermissionGate permission="vehicles:view">
            <Link to="/vehicles/new"><Button type="button">Tambah Kendaraan Baru +</Button></Link>
          </PermissionGate>
        )}
      />
      <Card>
        {vehiclesQuery.isLoading ? (
          <LoadingState message="Memuat daftar kendaraan..." rows={3} />
        ) : displayRows.length === 0 ? (
          <EmptyState message="Belum ada data kendaraan. Tambahkan unit pertama untuk mulai sinkronisasi dengan backend." />
        ) : (
          <div className="space-y-4">
            {useMockData ? <ErrorState message="Data kendaraan backend belum tersedia." description="Data lokal dan data contoh tetap ditampilkan agar list kendaraan bisa diuji." /> : null}
            <div className="grid gap-3">
              {displayRows.map((row) => (
                <VehicleListItem key={row.plate} row={row} onDelete={() => handleDelete(row.plate)} />
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

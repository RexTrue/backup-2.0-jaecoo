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
import { customerRowsMock } from '@/modules/customers/mocks/customer.mock';
import { useCustomers } from '@/modules/customers/hooks/use-customers';
import { mapCustomerToListRow } from '@/modules/customers/mappers/customer-mappers';
import type { CustomerListRow } from '@/modules/customers/types/customer.types';
import type { Customer } from '@/common/types/domain';
import { getLocalEntities } from '@/common/lib/local-entity-store';

export function CustomerListPage() {
  const customersQuery = useCustomers();
  const customers = customersQuery.data;
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const rows = useMemo(() => (customers?.length ? customers.map(mapCustomerToListRow) : []), [customers]);
  const localRows = useMemo(() => getLocalEntities<Customer>('customers').map(mapCustomerToListRow), []);
  const useMockData = shouldUseMockFallback(customersQuery.isError);

  const displayRows: CustomerListRow[] = useMemo(() => {
    const base = useMockData ? customerRowsMock : rows;
    const deduped = [...localRows, ...base];
    return deduped.filter((item, index) => deduped.findIndex((candidate) => candidate.nik === item.nik) === index);
  }, [localRows, rows, useMockData]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Pelanggan"
        title="Pelanggan"
        actions={(
          <PermissionGate permission="work-orders:create">
            <Link to="/customers/new"><Button type="button">Tambah Pelanggan Baru +</Button></Link>
          </PermissionGate>
        )}
      />
      <Card>
        {customersQuery.isLoading ? (
          <LoadingState message="Memuat daftar pelanggan..." rows={3} />
        ) : displayRows.length === 0 ? (
          <EmptyState message="Belum ada data pelanggan. Tambahkan pelanggan pertama untuk mulai alur operasional." />
        ) : (
          <div className="space-y-4">
            {useMockData ? <ErrorState message="Data pelanggan backend belum tersedia." description="Data lokal dan data contoh tetap ditampilkan agar alur list-first CRUD bisa diuji." /> : null}
            <div className="grid gap-3">
              {displayRows.map((row) => (
                <ListCard
                  key={row.nik}
                  title={row.name}
                  subtitle={<p className="text-xs theme-muted">NIK {row.nik}</p>}
                  meta={<div className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-1 text-xs theme-muted">{row.units} kendaraan</div>}
                  footer={(
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm theme-muted">Kontak: {row.phone}</p>
                      <PermissionGate permission="work-orders:create">
                        <div className="action-strip">
                          <Button variant="secondary" type="button">Detail</Button>
                          <Button
                            variant="danger"
                            type="button"
                            onClick={async () => {
                              const approved = await confirm({ title: `Hapus pelanggan ${row.name}?`, description: 'Aksi hapus pelanggan akan dihubungkan ke backend pada tahap berikutnya.', confirmLabel: 'Hapus', tone: 'danger' });
                              if (approved) showToast({ title: 'Aksi disiapkan', description: 'Endpoint hapus pelanggan belum diaktifkan.', tone: 'info' });
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </PermissionGate>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

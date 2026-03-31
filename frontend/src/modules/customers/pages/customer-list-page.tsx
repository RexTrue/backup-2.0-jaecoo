import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { Button } from '@/common/components/ui/button';
import { ListCard } from '@/common/components/data-display/list-card';
import { PageHeader } from '@/common/components/page/page-header';
import { PermissionGate } from '@/common/components/auth/permission-gate';
import { useCustomers, useDeleteCustomer } from '@/modules/customers/hooks/use-customers';
import { mapCustomerToListRow } from '@/modules/customers/mappers/customer-mappers';
import type { CustomerListRow } from '@/modules/customers/types/customer.types';
import type { Customer } from '@/common/types/domain';
import { getLocalEntities, useLocalEntities } from '@/common/lib/local-entity-store';

export function CustomerListPage() {
  const customersQuery = useCustomers();
  const deleteCustomerMutation = useDeleteCustomer();
  const customers = customersQuery.data;
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const rows = useMemo(() => (customers?.length ? customers.map(mapCustomerToListRow) : []), [customers]);
  const localRows = useLocalEntities<Customer>('customers').map(mapCustomerToListRow);

  const displayRows: CustomerListRow[] = useMemo(() => {
    const deduped = [...localRows, ...rows];
    return deduped.filter((item, index) => deduped.findIndex((candidate) => candidate.nik === item.nik) === index);
  }, [localRows, rows]);

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
                              const approved = await confirm({ title: `Hapus pelanggan ${row.name}?`, description: 'Data pelanggan akan dihapus secara permanen.', confirmLabel: 'Hapus', tone: 'danger' });
                              if (approved) {
                                try {
                                  await deleteCustomerMutation.mutateAsync(row.nik);
                                  showToast({ title: 'Pelanggan berhasil dihapus', description: 'Data pelanggan telah dihapus dari sistem.', tone: 'success' });
                                } catch (error) {
                                  showToast({ title: 'Gagal menghapus pelanggan', description: 'Terjadi kesalahan saat menghapus data pelanggan.', tone: 'error' });
                                }
                              }
                            }}
                            disabled={deleteCustomerMutation.isPending}
                          >
                            {deleteCustomerMutation.isPending ? 'Menghapus...' : 'Hapus'}
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

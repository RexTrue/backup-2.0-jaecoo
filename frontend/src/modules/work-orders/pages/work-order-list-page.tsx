import { useMemo } from 'react';
import { Card } from '@/common/components/ui/card';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { ErrorState } from '@/common/components/feedback/error-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { Button } from '@/common/components/ui/button';
import { ListCard } from '@/common/components/data-display/list-card';
import { StatCard } from '@/common/components/data-display/stat-card';
import { PageHeader } from '@/common/components/page/page-header';
import { shouldUseMockFallback } from '@/common/lib/query-fallback';
import { workOrderRowsMock, workOrderStatesMock } from '@/modules/work-orders/mocks/work-order.mock';
import { useWorkOrders } from '@/modules/work-orders/hooks/use-work-orders';
import { buildWorkOrderSummaryCards, mapWorkOrderToListRow } from '@/modules/work-orders/mappers/work-order-mappers';

export function WorkOrderListPage() {
  const workOrdersQuery = useWorkOrders();
  const workOrders = workOrdersQuery.data;

  const summaryCards = useMemo(() => (workOrders?.length ? buildWorkOrderSummaryCards(workOrders) : []), [workOrders]);
  const rows = useMemo(() => (workOrders?.length ? workOrders.map(mapWorkOrderToListRow) : []), [workOrders]);
  const useMockData = shouldUseMockFallback(workOrdersQuery.isError);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Work Order" title="Work Order" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(useMockData ? workOrderStatesMock : summaryCards).map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} note={item.note} />
        ))}
      </div>

      <Card>
        {workOrdersQuery.isLoading ? (
          <LoadingState message="Memuat daftar work order..." rows={4} />
        ) : useMockData ? (
          <div className="space-y-4">
            <ErrorState message="Data work order backend belum tersedia." description="Menampilkan data contoh sementara untuk pengecekan flow list dan summary card." />
            <div className="space-y-3">
              {workOrderRowsMock.map((item) => (
                <div key={item.code} className="data-row rounded-[22px] p-4">
                  <ListCard
                    title={item.code}
                    subtitle={(
                      <>
                        <p>{item.unit}</p>
                        <p className="mt-1 text-xs theme-muted">{item.owner}</p>
                      </>
                    )}
                    meta={(
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.18em] theme-muted">{item.status}</p>
                        <div className="action-strip mt-3 justify-end">
                          <Button variant="secondary" type="button">Edit</Button>
                          <Button variant="danger" type="button">Hapus</Button>
                        </div>
                      </div>
                    )}
                    className="border-none bg-transparent p-0"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : rows.length === 0 ? (
          <EmptyState message="Belum ada work order. Buat work order pertama untuk mulai menguji alur servis." />
        ) : (
          <div className="space-y-3">
            {rows.map((item) => (
              <div key={item.code} className="data-row rounded-[22px] p-4">
                <ListCard
                  title={item.code}
                  subtitle={(
                    <>
                      <p>{item.unit}</p>
                      <p className="mt-1 text-xs theme-muted">{item.owner}</p>
                    </>
                  )}
                  meta={(
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.18em] theme-muted">{item.status}</p>
                      <div className="action-strip mt-3 justify-end">
                        <Button variant="secondary" type="button">Edit</Button>
                        <Button variant="danger" type="button">Hapus</Button>
                      </div>
                    </div>
                  )}
                  className="border-none bg-transparent p-0"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

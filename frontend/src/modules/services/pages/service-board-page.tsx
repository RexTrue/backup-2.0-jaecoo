import { useMemo } from 'react';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { ErrorState } from '@/common/components/feedback/error-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { PageHeader } from '@/common/components/page/page-header';
import { shouldUseMockFallback } from '@/common/lib/query-fallback';
import { ServiceBoard } from '@/modules/services/components/service-board';
import { serviceBoardMock } from '@/modules/services/mocks/service.mock';
import { useServices } from '@/modules/services/hooks/use-services';

export function ServiceBoardPage() {
  const servicesQuery = useServices();
  const services = servicesQuery.data;
  const boardServices = useMemo(() => (services?.length ? services : []), [services]);
  const useMockData = shouldUseMockFallback(servicesQuery.isError);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Servis" title="Board Servis" />
      {servicesQuery.isLoading ? (
        <LoadingState message="Memuat board servis..." rows={6} />
      ) : useMockData ? (
        <div className="space-y-4">
          <ErrorState message="Board servis backend belum tersedia." description="Menampilkan data contoh sementara agar distribusi status tetap bisa diperiksa." />
          <ServiceBoard services={serviceBoardMock} />
        </div>
      ) : boardServices.length === 0 ? (
        <EmptyState message="Belum ada servis aktif. Work order baru akan muncul di board setelah data backend tersedia." />
      ) : (
        <ServiceBoard services={boardServices} />
      )}
    </div>
  );
}

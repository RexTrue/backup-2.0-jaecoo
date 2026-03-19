import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { Button } from '@/common/components/ui/button';
import { ListCard } from '@/common/components/data-display/list-card';
import { PageHeader } from '@/common/components/page/page-header';
import { PermissionGate } from '@/common/components/auth/permission-gate';
import { useUsers } from '@/modules/users/hooks/use-users';
import { mapUserToListRow } from '@/modules/users/mappers/user-mappers';
import type { UserListRow } from '@/modules/users/types/user.types';
import type { User } from '@/common/types/domain';
import { getLocalEntities } from '@/common/lib/local-entity-store';

export function UserManagementPage() {
  const usersQuery = useUsers();
  const users = usersQuery.data;

  const rows = useMemo(() => (users?.length ? users.map(mapUserToListRow) : []), [users]);
  const localRows = useMemo(() => getLocalEntities<User>('users').map(mapUserToListRow), []);

  const displayRows: UserListRow[] = useMemo(() => {
    const deduped = [...localRows, ...rows];
    return deduped.filter((item, index) => deduped.findIndex((candidate) => candidate.email === item.email) === index);
  }, [localRows, rows]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Pegawai"
        title="Pegawai"
        actions={(
          <PermissionGate permission="users:update">
            <Link to="/users/new"><Button type="button">Tambah User Baru +</Button></Link>
          </PermissionGate>
        )}
      />
      <Card>
        {usersQuery.isLoading ? (
          <LoadingState message="Memuat daftar pegawai..." rows={4} />
        ) : displayRows.length === 0 ? (
          <EmptyState message="Belum ada data pegawai yang tersedia." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {displayRows.map((row) => (
              <Card key={row.email}>
                <ListCard
                  title={row.email}
                  subtitle={(
                    <>
                      <p className="mt-3">Role: {row.role}</p>
                      <p className="mt-1">Status: {row.status}</p>
                    </>
                  )}
                  meta={<span className="text-xs theme-muted">Mode baca siap untuk integrasi endpoint edit dan nonaktifkan pada tahap backend.</span>}
                  className="border-none bg-transparent p-0"
                />
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

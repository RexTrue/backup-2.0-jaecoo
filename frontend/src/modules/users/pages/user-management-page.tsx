import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/common/components/ui/card';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { ErrorState } from '@/common/components/feedback/error-state';
import { LoadingState } from '@/common/components/feedback/loading-state';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select } from '@/common/components/ui/select';
import { FieldError, FieldHint, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { ListCard } from '@/common/components/data-display/list-card';
import { PageHeader } from '@/common/components/page/page-header';
import { shouldUseMockFallback } from '@/common/lib/query-fallback';
import { userRowsMock } from '@/modules/users/mocks/user.mock';
import { useCreateUser, useUsers } from '@/modules/users/hooks/use-users';
import { mapUserToListRow } from '@/modules/users/mappers/user-mappers';
import type { CreateUserPayload } from '@/modules/users/types/user.types';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['MEKANIK', 'FRONTLINE', 'MANAGER', 'ADMIN']),
  isActive: z.enum(['true', 'false']).default('true'),
});

type FormValues = z.infer<typeof schema>;

export function UserManagementPage() {
  const [lastPayload, setLastPayload] = useState<CreateUserPayload>();
  const [submitState, setSubmitState] = useState<string>();
  const usersQuery = useUsers();
  const users = usersQuery.data;
  const createUserMutation = useCreateUser();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', role: 'FRONTLINE', isActive: 'true' },
  });

  const rows = useMemo(() => (users?.length ? users.map(mapUserToListRow) : []), [users]);
  const useMockData = shouldUseMockFallback(usersQuery.isError);

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateUserPayload = {
      email: values.email,
      password: values.password,
      role: values.role,
      isActive: values.isActive === 'true',
    };
    setLastPayload(payload);

    try {
      await createUserMutation.mutateAsync(payload);
      setSubmitState('Payload user berhasil dikirim.');
      reset();
    } catch {
      setSubmitState('Payload user siap integrasi. Endpoint backend belum merespons.');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Pegawai" title="Pegawai" />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <FormShell eyebrow="Form" title="Input Pegawai" subtitle="Field mengikuti tabel User pada database.">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" placeholder="nama@service.com" {...register('email')} />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="Password awal" {...register('password')} />
              <FieldHint>Backend akan menyimpan password dalam bentuk hash.</FieldHint>
              <FieldError>{errors.password?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select id="role" {...register('role')}>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="FRONTLINE">FRONTLINE</option>
                <option value="MEKANIK">MEKANIK</option>
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="isActive">Status</FieldLabel>
              <Select id="isActive" {...register('isActive')}>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </Select>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isSubmitting || createUserMutation.isPending}>Simpan Pegawai</Button>
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>

        <div className="space-y-4">
          <PayloadPreview title="Payload Pegawai" payload={lastPayload} />
          {usersQuery.isLoading ? (
            <LoadingState message="Memuat daftar pegawai..." rows={4} />
          ) : useMockData ? (
            <div className="space-y-4">
              <ErrorState message="Data pegawai backend belum tersedia." description="Menampilkan data contoh sementara untuk validasi UI dan role card." />
              <div className="grid gap-4 lg:grid-cols-2">
                {userRowsMock.map((row) => (
                  <Card key={row.email}>
                    <ListCard
                      title={row.email}
                      subtitle={(
                        <>
                          <p className="mt-3">Role: {row.role}</p>
                          <p className="mt-1">Status: {row.status}</p>
                        </>
                      )}
                      meta={(
                        <div className="action-strip">
                          <Button variant="secondary" type="button">Edit</Button>
                          <Button variant="danger" type="button">Hapus</Button>
                        </div>
                      )}
                      className="border-none bg-transparent p-0"
                    />
                  </Card>
                ))}
              </div>
            </div>
          ) : rows.length === 0 ? (
            <EmptyState message="Belum ada data pegawai. Tambahkan akun pertama untuk mengaktifkan role-based flow." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {rows.map((row) => (
                <Card key={row.email}>
                  <ListCard
                    title={row.email}
                    subtitle={(
                      <>
                        <p className="mt-3">Role: {row.role}</p>
                        <p className="mt-1">Status: {row.status}</p>
                      </>
                    )}
                    meta={(
                      <div className="action-strip">
                        <Button variant="secondary" type="button">Edit</Button>
                        <Button variant="danger" type="button">Hapus</Button>
                      </div>
                    )}
                    className="border-none bg-transparent p-0"
                  />
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

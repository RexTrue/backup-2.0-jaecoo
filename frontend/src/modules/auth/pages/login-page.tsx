import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Card } from '@/common/components/ui/card';
import { useLogin, getErrorMessage } from '@/modules/auth/hooks/use-login';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { getDefaultRouteByRole, roleLabels } from '@/common/lib/authz';
import { ThemeLogo } from '@/common/components/ui/theme-logo';
import { useToast } from '@/common/components/feedback/toast-provider';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const loginMutation = useLogin();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'manager@service.com', password: 'Manager123!' },
  });

  useEffect(() => {
    if (loginMutation.isSuccess && user) {
      const targetPath = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname;
      showToast({ title: 'Login berhasil', description: `Role aktif: ${roleLabels[user.role]}.`, tone: 'success' });
      navigate(targetPath ?? getDefaultRouteByRole(user.role), { replace: true });
    }
  }, [location.state, loginMutation.isSuccess, navigate, user]);

  const errorMessage = loginMutation.isError ? getErrorMessage(loginMutation.error) : null;

  return (
    <div className="animate-fade-up">
      <div className="mb-6 lg:hidden">
        <ThemeLogo alt="JAECOO" className="h-7 w-auto" />

      </div>

      <Card className="rounded-[30px] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] theme-muted">JAECOO YOGYAKARTA | SERVICE MANAGEMENT SYSTEM</p>
            <h1 className="mt-3 text-3xl font-semibold text-gradient">Masuk</h1>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] theme-muted">Email</label>
            <Input placeholder="Masukkan email anda disini!" {...register('email')} />
            {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] theme-muted">Password</label>
            <Input type="password" placeholder="Masukkan kata sandi anda disini!" {...register('password')} />
            {errors.password && <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>}
          </div>
          {errorMessage && <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-500">{errorMessage}</p>}
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

      </Card>
    </div>
  );
}

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Card } from '@/common/components/ui/card';
import { useLogin, getErrorMessage } from '@/modules/auth/hooks/use-login';
import { createQuickDemoSession, demoCredentials } from '@/modules/auth/services/auth-api';
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
  const setSession = useAuthStore((state) => state.setSession);
  const loginMutation = useLogin();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
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
        <p className="mt-4 text-2xl font-semibold theme-text">Login</p>
      </div>

      <Card className="rounded-[30px] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] theme-muted">Login</p>
            <h1 className="mt-3 text-3xl font-semibold text-gradient">Masuk</h1>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const quickSession = createQuickDemoSession('manager@service.com');
              setSession({ token: quickSession.accessToken, user: quickSession.user });
              showToast({ title: 'Mode demo aktif', description: 'Masuk sebagai manager untuk meninjau alur utama.', tone: 'success' });
              navigate(getDefaultRouteByRole(quickSession.user.role), { replace: true });
            }}
          >
            Demo
          </Button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] theme-muted">Email</label>
            <Input placeholder="manager@service.com" {...register('email')} />
            {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] theme-muted">Password</label>
            <Input type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>}
          </div>
          {errorMessage && <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-500">{errorMessage}</p>}
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <div className="mt-7 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel-light)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold theme-text">Akun Demo</h2>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {demoCredentials.map((credential) => (
              <div key={credential.email} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--panel)] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium theme-text">{roleLabels[credential.role]}</p>
                    <p className="mt-1 text-xs theme-muted">{credential.email}</p>
                    <p className="text-xs theme-muted">{credential.password}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setValue('email', credential.email, { shouldValidate: true });
                        setValue('password', credential.password, { shouldValidate: true });
                      }}
                    >
                      Isi
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        const quickSession = createQuickDemoSession(credential.email);
                        setSession({ token: quickSession.accessToken, user: quickSession.user });
                        showToast({ title: 'Mode demo aktif', description: `Masuk sebagai ${roleLabels[quickSession.user.role]}.`, tone: 'success' });
                        navigate(getDefaultRouteByRole(quickSession.user.role), { replace: true });
                      }}
                    >
                      Masuk
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

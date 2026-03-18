import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { appRoutes } from '@/config/route.config';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { Button } from '@/common/components/ui/button';
import { ThemeToggle } from '@/common/components/ui/theme-toggle';
import { Card } from '@/common/components/ui/card';
import { hasPermission, roleLabels } from '@/common/lib/authz';
import { ThemeLogo } from '@/common/components/ui/theme-logo';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [open, setOpen] = useState(false);

  const allowedRoutes = useMemo(
    () => appRoutes.main.filter((route) => hasPermission(user?.role, route.permission)),
    [user?.role],
  );

  const currentRoute = allowedRoutes.find((item) => location.pathname.startsWith(item.path));

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col">
      <Link to="/dashboard" className="glass-soft rounded-[26px] p-5" onClick={() => setOpen(false)}>
        <ThemeLogo alt="JAECOO" className="h-8 w-auto opacity-95" />
        <div className="mt-4 max-w-[190px] space-y-1">
          <p className="sidebar-title text-[clamp(1.05rem,1.2vw,1.55rem)] font-semibold leading-[1.08] theme-text">
            <span className="block">Yogyakarta</span>
            <span className="block">Service</span>
            <span className="block">Management</span>
          </p>
        </div>
      </Link>

      <Card className="mt-5 p-4">
        <p className="text-[11px] uppercase tracking-[0.28em] theme-muted">Akun</p>
        <p className="mt-3 break-all text-lg font-semibold theme-text">{user?.email}</p>
        <p className="mt-1 text-sm text-gradient-accent">{roleLabels[user?.role ?? 'ADMIN']}</p>
      </Card>

      <nav className="sidebar-scroll mt-5 flex-1 space-y-2 overflow-y-auto pr-1 text-left">
        {allowedRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.path === '/dashboard'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              [
                'group relative block overflow-hidden rounded-[22px] border p-4 transition duration-300',
                isActive
                  ? 'theme-line bg-[linear-gradient(135deg,var(--accent-soft),color-mix(in_srgb,var(--panel-light)_82%,transparent))] shadow-[0_18px_42px_rgba(0,0,0,0.12)]'
                  : 'border-transparent bg-transparent hover:border-[color:var(--line)] hover:bg-[color:var(--panel-light)]',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <div className="flex w-full items-center justify-start gap-3 text-left">
                <span
                  className={[
                    'h-2.5 w-2.5 rounded-full transition duration-200',
                    isActive ? 'bg-[color:var(--accent)] shadow-[0_0_0_6px_var(--accent-soft)]' : 'bg-[color:var(--muted)]/35 group-hover:bg-[color:var(--accent)]/70',
                  ].join(' ')}
                />
                <p className={['text-sm font-semibold', isActive ? 'theme-text' : 'theme-muted'].join(' ')}>{route.label}</p>
                {isActive && <span className="ml-auto h-8 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-5 grid grid-cols-2 gap-3 text-left">
        <Button variant="secondary" onClick={() => navigate('/work-orders/new')}>
          WO Baru
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            clearSession();
            navigate('/login', { replace: true });
          }}
        >
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen bg-[color:var(--bg)]/10">
        <div className="flex min-h-screen items-start">
          <aside className="sticky top-0 hidden h-screen w-[340px] shrink-0 self-start p-4 lg:block">
            <div className="glass-mobile h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] p-5">{sidebar}</div>
          </aside>

          {open && (
            <div className="fixed inset-0 z-50 bg-black/45 lg:hidden" onClick={() => setOpen(false)}>
              <aside className="glass-mobile h-full w-[86%] max-w-[320px] overflow-hidden rounded-r-[30px] p-5" onClick={(event) => event.stopPropagation()}>
                {sidebar}
              </aside>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 px-4 py-4 md:px-6 xl:px-8">
              <div className="topbar-surface glass-soft mx-auto flex max-w-full items-center justify-between gap-3 rounded-[26px] border px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.14)] md:px-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-light)] text-xl theme-text lg:hidden"
                    onClick={() => setOpen(true)}
                    aria-label="Buka navigasi"
                  >
                    ☰
                  </button>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] theme-muted">JAECOO Yogyakarta</p>
                    <h1 className="text-sm font-medium theme-text md:text-base">{currentRoute?.label ?? 'Dashboard'}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <Button variant="secondary" className="hidden md:inline-flex" onClick={() => navigate('/services')}>Board</Button>
                  <ThemeToggle className="shrink-0" />
                </div>
              </div>
            </header>

            <main className="page-shell animate-fade-up">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

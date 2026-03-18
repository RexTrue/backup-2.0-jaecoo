import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { appRoutes } from '@/config/route.config';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { Button } from '@/common/components/ui/button';
import { ThemeLogo } from '@/common/components/ui/theme-logo';
import { ThemeToggle } from '@/common/components/ui/theme-toggle';

export function MechanicLayout() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [open, setOpen] = useState(false);

  const menu = (
    <div className="flex h-full min-h-0 flex-col">
      <Link to="/mechanic/tasks" className="glass-soft rounded-[24px] p-5" onClick={() => setOpen(false)}>
        <ThemeLogo alt="JAECOO" className="h-8 w-auto opacity-95" />
        <p className="mt-4 text-xs uppercase tracking-[0.28em] theme-muted">Mekanik Panel</p>
        <p className="mt-3 text-[clamp(1.05rem,1.2vw,1.5rem)] font-semibold leading-tight theme-text">Service Tasks</p>
      </Link>
      <nav className="sidebar-scroll mt-5 flex-1 space-y-2 overflow-y-auto pr-1">
        {appRoutes.mechanic.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              [
                'block rounded-[22px] border p-4 transition duration-300',
                isActive
                  ? 'theme-line bg-[linear-gradient(135deg,var(--accent-soft),color-mix(in_srgb,var(--panel-light)_82%,transparent))]'
                  : 'border-transparent hover:border-[color:var(--line)] hover:bg-[color:var(--panel-light)]',
              ].join(' ')
            }
          >
            <p className="text-sm font-semibold theme-text">{route.label}</p>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-5">
        <Button
          variant="ghost"
          className="w-full"
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
          <aside className="sticky top-0 hidden h-screen w-[320px] shrink-0 self-start p-4 md:block"><div className="glass-mobile h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] p-5">{menu}</div></aside>
          {open && (
            <div className="fixed inset-0 z-50 bg-black/45 md:hidden" onClick={() => setOpen(false)}>
              <aside className="glass-mobile h-full w-[86%] max-w-[300px] overflow-hidden rounded-r-[30px] p-5" onClick={(e) => e.stopPropagation()}>{menu}</aside>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <header className="topbar-surface sticky top-0 z-30 border-b px-4 py-3 backdrop-blur-xl md:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-light)] text-xl theme-text md:hidden" onClick={() => setOpen(true)}>☰</button>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] theme-muted">Mode mekanik</p>
                    <p className="text-sm font-medium theme-text">Tugas Servis</p>
                  </div>
                </div>
<div className="flex items-center gap-3 flex-wrap justify-end"><Button variant="secondary" className="hidden md:inline-flex" onClick={() => navigate('/services')}>Board Servis</Button><ThemeToggle /></div>
              </div>
            </header>
            <main className="page-shell animate-fade-up"><Outlet /></main>
          </div>
        </div>
      </div>
    </div>
  );
}

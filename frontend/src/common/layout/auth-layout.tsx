import { Outlet } from 'react-router-dom';
import { ThemeLogo } from '@/common/components/ui/theme-logo';

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,167,109,0.22),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(130,161,255,0.15),transparent_18%)]" />
      <div className="glass relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-stretch overflow-hidden rounded-[36px] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden min-h-full flex-col gap-8 border-r border-[color:var(--line)] bg-[color:var(--panel-light)]/40 p-10 lg:flex">
          <div>
            <ThemeLogo alt="JAECOO" className="h-8 w-auto opacity-95" />
            <p className="mt-8 max-w-xl text-4xl font-semibold leading-tight theme-text">
              JAECOO Yogyakarta <span className="text-gradient">Service Management System</span>
            </p>
            <p className="mt-4 max-w-lg text-sm leading-7 theme-muted">
              Akses yang rapi, cepat, dan konsisten untuk seluruh alur servis.
            </p>
          </div>

          <div className="relative mt-auto overflow-hidden rounded-[30px] border border-[color:var(--line)] bg-[color:var(--panel-light)]/35 p-4">
            <img src="/assets/img2.webp" alt="JAECOO Product" className="h-[320px] w-full rounded-xl object-cover opacity-95 transition duration-500 hover:scale-[1.02]" />
          </div>
        </div>

        <div className="relative flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, type ReactNode } from 'react';
import DashboardSidebar, { type DashboardMenuItem } from './dashboard-sidebar';
import DashboardTopbar from './dashboard-topbar';

interface DashboardShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  menus?: DashboardMenuItem[];
  roleLabel?: string;
  footerText?: string;
  breadcrumb?: string;
  searchPlaceholder?: string;
  topbarActions?: ReactNode;
}

function getIsMobileViewport() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(max-width: 960px)').matches;
}

export default function DashboardShell({
  title,
  subtitle,
  children,
  menus,
  roleLabel,
  footerText,
  breadcrumb,
  searchPlaceholder,
  topbarActions,
}: DashboardShellProps) {
  const [isMobile, setIsMobile] = useState(getIsMobileViewport);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 960px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      if (!event.matches) {
        setSidebarOpen(false);
      }
    };

    setIsMobile(media.matches);

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menus={menus}
        roleLabel={roleLabel}
        footerText={footerText}
      />
      <div className="dashboard-shell__main">
        <DashboardTopbar
          title={title}
          subtitle={subtitle}
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumb={breadcrumb}
          searchPlaceholder={searchPlaceholder}
          actions={topbarActions}
        />
        <main className="dashboard-shell__content">{children}</main>
      </div>
    </div>
  );
}

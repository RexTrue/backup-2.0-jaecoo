import type { ReactNode } from 'react';

interface DashboardTopbarProps {
  title: string;
  subtitle: string;
  isMobile?: boolean;
  onMenuClick?: () => void;
  breadcrumb?: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BrandSignature() {
  return (
    <div className="dashboard-topbar__brandmark" aria-label="JAECOO Yogyakarta">
      <img src="/assets/logo-jaecoo-black-large.png" alt="JAECOO" className="dashboard-topbar__brandmark-logo" />
      <span className="dashboard-topbar__brandmark-text">Yogyakarta</span>
    </div>
  );
}

export default function DashboardTopbar({
  title,
  subtitle,
  isMobile = false,
  onMenuClick,
  breadcrumb = 'Dashboard / Admin',
  searchPlaceholder = 'Cari user, kendaraan, work order...',
  actions,
}: DashboardTopbarProps) {
  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar__intro">
        <div className="dashboard-topbar__brand-row">
          <BrandSignature />
          {isMobile ? (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Buka menu navigasi"
              className="dashboard-topbar__button dashboard-topbar__button--ghost"
              style={{
                height: 42,
                minWidth: 42,
                width: 42,
                padding: 0,
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuIcon />
            </button>
          ) : null}
        </div>

        <div style={{ minWidth: 0, width: '100%' }}>
          <p className="dashboard-topbar__breadcrumb">{breadcrumb}</p>
          <div
            style={{
              display: 'flex',
              alignItems: isMobile ? 'center' : 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: isMobile ? 'nowrap' : 'wrap',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h1 className="dashboard-topbar__title">{title}</h1>
              <p className="dashboard-topbar__subtitle">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="dashboard-topbar__actions"
        style={
          isMobile
            ? {
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 10,
              }
            : undefined
        }
      >
        <label className="dashboard-search" style={isMobile ? { width: '100%' } : undefined}>
          <input type="search" placeholder={searchPlaceholder} />
        </label>

        {isMobile ? null : actions}
      </div>
    </header>
  );
}

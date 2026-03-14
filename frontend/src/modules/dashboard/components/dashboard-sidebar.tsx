import { NavLink } from 'react-router-dom';

export interface DashboardMenuItem {
  label: string;
  to: string;
}

const defaultMenus: DashboardMenuItem[] = [
  { label: 'Dashboard', to: '/dashboard/admin' },
  { label: 'Manajemen User', to: '/dashboard/admin/users' },
  { label: 'Master Jenis Servis', to: '/dashboard/admin/services' },
  { label: 'Data Pelanggan', to: '/dashboard/admin/customers' },
  { label: 'Data Kendaraan', to: '/dashboard/admin/vehicles' },
  { label: 'Work Order', to: '/dashboard/admin/work-orders' },
  { label: 'Laporan', to: '/dashboard/admin/reports' },
  { label: 'Pengaturan', to: '/dashboard/admin/settings' },
];

interface DashboardSidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  menus?: DashboardMenuItem[];
  roleLabel?: string;
  footerText?: string;
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SidebarContent({
  onClose,
  menus,
  roleLabel,
  footerText,
}: {
  onClose?: () => void;
  menus: DashboardMenuItem[];
  roleLabel: string;
  footerText: string;
}) {
  return (
    <>
      <div className="dashboard-sidebar__brand">
        <img src="/assets/logo-jaecoo-black.png" alt="JAECOO" className="dashboard-sidebar__logo" />
        <div>
          <p className="dashboard-sidebar__city">Yogyakarta</p>
          <span className="dashboard-sidebar__role">{roleLabel}</span>
        </div>
      </div>

      <nav className="dashboard-sidebar__nav">
        {menus.map((menu) => (
          <NavLink
            key={menu.to}
            to={menu.to}
            onClick={onClose}
            className={({ isActive }) =>
              `dashboard-sidebar__link${isActive ? ' dashboard-sidebar__link--active' : ''}`
            }
          >
            <span className="dashboard-sidebar__link-dot" />
            {menu.label}
          </NavLink>
        ))}
      </nav>

      <div className="dashboard-sidebar__footer">
        <p>{footerText}</p>
      </div>
    </>
  );
}

export default function DashboardSidebar({
  isMobile = false,
  isOpen = false,
  onClose,
  menus = defaultMenus,
  roleLabel = 'Admin Console',
  footerText = 'Prototype internal JAECOO Service Management System.',
}: DashboardSidebarProps) {
  if (isMobile) {
    if (!isOpen) {
      return null;
    }

    return (
      <>
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 24, 0.45)',
            border: 'none',
            padding: 0,
            zIndex: 40,
            cursor: 'pointer',
          }}
        />
        <aside
          className="dashboard-sidebar"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: 'min(88vw, 340px)',
            zIndex: 50,
            overflowY: 'auto',
            boxShadow: '0 24px 60px rgba(10, 15, 24, 0.18)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu navigasi"
              className="dashboard-topbar__button dashboard-topbar__button--ghost"
              style={{
                height: 40,
                minWidth: 40,
                width: 40,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <SidebarContent
            onClose={onClose}
            menus={menus}
            roleLabel={roleLabel}
            footerText={footerText}
          />
        </aside>
      </>
    );
  }

  return (
    <aside className="dashboard-sidebar">
      <SidebarContent menus={menus} roleLabel={roleLabel} footerText={footerText} />
    </aside>
  );
}

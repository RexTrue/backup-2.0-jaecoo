import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

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

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11.5L12 5l8 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 10.5V19h11v-8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 18a4.5 4.5 0 0 1 9 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5 11a2.5 2.5 0 1 0 0-5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.5 15.5a4 4 0 0 1 4 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 5.5a4.5 4.5 0 0 0-4 6.56L5.7 16.35a1 1 0 0 0 0 1.42l.53.53a1 1 0 0 0 1.41 0l4.3-4.29A4.5 4.5 0 1 0 14 5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CustomerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VehicleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 16.5h11l-1-5.5a2 2 0 0 0-2-1.5h-5a2 2 0 0 0-2 1.5l-1 5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 16.5v1a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 17.5v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="17" r="1" fill="currentColor" />
      <circle cx="16" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="5" width="12" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 5.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 10h6M9 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 18V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 18v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.5 18.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 9.25A2.75 2.75 0 1 1 9.25 12 2.75 2.75 0 0 1 12 9.25Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19 12a7.35 7.35 0 0 0-.08-1l1.53-1.2-1.5-2.6-1.87.62a7.74 7.74 0 0 0-1.73-1l-.29-1.95h-3l-.29 1.95a7.74 7.74 0 0 0-1.73 1l-1.87-.62-1.5 2.6L5.08 11a7.35 7.35 0 0 0 0 2l-1.53 1.2 1.5 2.6 1.87-.62a7.74 7.74 0 0 0 1.73 1l.29 1.95h3l.29-1.95a7.74 7.74 0 0 0 1.73-1l1.87.62 1.5-2.6-1.53-1.2c.05-.33.08-.66.08-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="6" width="15" height="13.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 4.5v3M16 4.5v3M4.5 9.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5.5 12.5 10 17l8.5-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4.5 20 18H4l8-13.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9v4.5M12 16.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function shortLabel(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes('manajemen user')) return 'User';
  if (lower.includes('master jenis servis')) return 'Servis';
  if (lower.includes('pelanggan')) return 'Pelanggan';
  if (lower.includes('kendaraan')) return 'Kendaraan';
  if (lower.includes('work order')) return 'Work Order';
  if (lower.includes('pengaturan')) return 'Pengaturan';
  if (lower.includes('persetujuan')) return 'Persetujuan';
  if (lower.includes('kendala')) return 'Kendala';
  if (lower.includes('laporan shift')) return 'Shift';
  if (lower.includes('jadwal')) return 'Jadwal';
  if (lower.includes('timeline')) return 'Timeline';
  if (lower.includes('permintaan part')) return 'Part';
  if (lower.includes('final check')) return 'Final Check';
  if (lower.includes('penerimaan unit')) return 'Penerimaan';
  if (lower.includes('serah terima')) return 'Serah Terima';
  if (lower.includes('follow-up')) return 'Follow-up';
  return label;
}

function getMenuIcon(label: string, to: string): ReactNode {
  const value = `${label} ${to}`.toLowerCase();
  if (value.includes('dashboard')) return <DashboardIcon />;
  if (value.includes('user')) return <UsersIcon />;
  if (value.includes('service') || value.includes('servis')) return <ServiceIcon />;
  if (value.includes('customer') || value.includes('pelanggan')) return <CustomerIcon />;
  if (value.includes('vehicle') || value.includes('kendaraan')) return <VehicleIcon />;
  if (value.includes('work-order') || value.includes('work order') || value.includes('queue') || value.includes('reception')) return <ClipboardIcon />;
  if (value.includes('report') || value.includes('laporan')) return <ReportIcon />;
  if (value.includes('setting') || value.includes('pengaturan')) return <SettingsIcon />;
  if (value.includes('booking') || value.includes('jadwal')) return <CalendarIcon />;
  if (value.includes('approval') || value.includes('quality') || value.includes('final-check')) return <CheckIcon />;
  if (value.includes('issue') || value.includes('kendala')) return <WarningIcon />;
  return <DashboardIcon />;
}

function getAccountName(roleLabel: string) {
  const value = roleLabel.toLowerCase();
  if (value.includes('admin')) return 'Dharma Yudha';
  if (value.includes('manager')) return 'Rangga Pratama';
  if (value.includes('front')) return 'Ayu Maharani';
  if (value.includes('mekanik')) return 'Budi Santoso';
  return 'JAECOO Staff';
}

function getAccountInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
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
  const compactMenus = menus.slice(0, 6);
  const accountName = getAccountName(roleLabel);
  const accountInitials = getAccountInitials(accountName);

  return (
    <>
      <div className="dashboard-sidebar__brand dashboard-sidebar__profile-card dashboard-sidebar__brand-card">
        <div className="dashboard-sidebar__identity dashboard-sidebar__identity--brand">
          <div className="dashboard-sidebar__avatar dashboard-sidebar__avatar--brand">
            <img
              src="/assets/logo-jaecoo-black-large.png"
              alt="JAECOO"
              className="dashboard-sidebar__logo"
            />
          </div>
          <div>
            <p className="dashboard-sidebar__city">Yogyakarta</p>
            <span className="dashboard-sidebar__role">{roleLabel}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sidebar__account-card">
        <div className="dashboard-sidebar__account-avatar">{accountInitials}</div>
        <div className="dashboard-sidebar__account-copy">
          <strong>{accountName}</strong>
          <span>{roleLabel}</span>
        </div>
        <span className="dashboard-sidebar__account-status">Online</span>
      </div>

      <div className="dashboard-sidebar__section-label">Workspace</div>
      <nav className="dashboard-sidebar__nav">
        {compactMenus.map((menu) => (
          <NavLink
            key={menu.to}
            to={menu.to}
            onClick={onClose}
            className={({ isActive }) =>
              `dashboard-sidebar__link${isActive ? ' dashboard-sidebar__link--active' : ''}`
            }
            title={menu.label}
          >
            <span className="dashboard-sidebar__link-icon">{getMenuIcon(menu.label, menu.to)}</span>
            <span className="dashboard-sidebar__link-label">{shortLabel(menu.label)}</span>
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
            background: 'rgba(10, 15, 24, 0.38)',
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
            top: 12,
            left: 12,
            bottom: 12,
            width: 'min(82vw, 320px)',
            zIndex: 50,
            overflowY: 'auto',
            boxShadow: '0 24px 60px rgba(10, 15, 24, 0.16)',
            borderRadius: 30,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu navigasi"
              className="dashboard-topbar__button dashboard-topbar__button--ghost"
              style={{
                height: 38,
                minWidth: 38,
                width: 38,
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

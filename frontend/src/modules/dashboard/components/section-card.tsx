import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <section className="dashboard-section-card">
      <header className="dashboard-section-card__header">
        <div>
          <h2 className="dashboard-section-card__title">{title}</h2>
          {subtitle ? <p className="dashboard-section-card__subtitle">{subtitle}</p> : null}
        </div>
        {action ? <div className="dashboard-section-card__action">{action}</div> : null}
      </header>
      <div className="dashboard-section-card__body">{children}</div>
    </section>
  );
}

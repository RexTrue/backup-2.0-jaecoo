interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  trend: string;
}

export default function StatCard({ label, value, hint, trend }: StatCardProps) {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-card__top">
        <span className="dashboard-stat-card__label">{label}</span>
        <span className="dashboard-stat-card__icon">●</span>
      </div>
      <strong className="dashboard-stat-card__value">{value}</strong>
      <p className="dashboard-stat-card__hint">{hint}</p>
      <span className="dashboard-stat-card__trend">{trend}</span>
    </article>
  );
}

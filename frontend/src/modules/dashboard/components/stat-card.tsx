interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  trend: string;
}

function getCardTone(label: string, hint: string, trend: string) {
  const value = `${label} ${hint} ${trend}`.toLowerCase();

  if (
    value.includes('urgent') ||
    value.includes('terkendala') ||
    value.includes('eskalasi') ||
    value.includes('harus') ||
    value.includes('high priority')
  ) {
    return 'urgent';
  }

  if (
    value.includes('pending') ||
    value.includes('approval') ||
    value.includes('follow-up') ||
    value.includes('menunggu') ||
    value.includes('perlu')
  ) {
    return 'warning';
  }

  if (
    value.includes('selesai') ||
    value.includes('ready') ||
    value.includes('aktif') ||
    value.includes('aman') ||
    value.includes('lolos')
  ) {
    return 'success';
  }

  return 'neutral';
}

export default function StatCard({ label, value, hint, trend }: StatCardProps) {
  const tone = getCardTone(label, hint, trend);

  return (
    <article className={`dashboard-stat-card dashboard-stat-card--${tone}`}>
      <div className="dashboard-stat-card__top">
        <span className="dashboard-stat-card__label">{label}</span>
        <span className="dashboard-stat-card__icon" aria-hidden="true" />
      </div>
      <strong className="dashboard-stat-card__value">{value}</strong>
      <p className="dashboard-stat-card__hint">{hint}</p>
      <span className="dashboard-stat-card__trend">{trend}</span>
    </article>
  );
}

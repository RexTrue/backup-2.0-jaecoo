import { Link } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { DashboardKpiCard } from '@/modules/dashboard/types/dashboard.types';

export function DashboardKpiCardView({ card }: { card: DashboardKpiCard }) {
  return (
    <Link to={card.href} className="card-link">
      <Card className={`rounded-[24px] border overflow-hidden cursor-pointer transition duration-300 hover:-translate-y-1 hover:scale-[1.01] ${card.tone}`}>
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-sm leading-5 theme-muted">{card.label}</p>
          {card.chip ? <span className="shrink-0 rounded-full border border-[color:var(--line)] bg-black/18 px-2.5 py-1 text-xs theme-muted">{card.chip}</span> : null}
        </div>
        <p className="mt-5 text-3xl font-semibold tracking-tight theme-text md:text-4xl">{card.value}</p>
      </Card>
    </Link>
  );
}

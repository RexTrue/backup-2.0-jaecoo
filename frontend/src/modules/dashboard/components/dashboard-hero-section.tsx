import { useNavigate } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { DashboardConfig } from '@/modules/dashboard/types/dashboard.types';

export function DashboardHeroSection({ config }: { config: DashboardConfig }) {
  const navigate = useNavigate();

  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="overflow-hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">{config.eyebrow}</p>
          <h2 className="section-title mt-4">{config.heading}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {config.focusCards.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.href)}
                className={`flex min-h-[168px] flex-col justify-between overflow-hidden rounded-[22px] border p-4 text-left transition duration-300 hover:-translate-y-1 hover:scale-[1.01] ${item.tone}`}
              >
                <div className="space-y-3">
                  <p className="min-h-[40px] text-sm leading-5 theme-text">{item.label}</p>
                  {item.chip ? <span className="inline-flex max-w-full rounded-full border border-[color:var(--line)] bg-black/18 px-2.5 py-1 text-[11px] leading-4 theme-muted">{item.chip}</span> : null}
                </div>
                <p className="mt-5 text-2xl font-semibold leading-none tracking-tight theme-text md:text-3xl">{item.value}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <img src={config.heroImage} alt="JAECOO" className="h-full min-h-[300px] w-full rounded-xl object-cover transition duration-700 hover:scale-[1.02]" />
      </Card>
    </section>
  );
}

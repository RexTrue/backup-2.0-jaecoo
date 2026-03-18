import { Card } from '@/common/components/ui/card';
import { StatusBadge } from '@/common/components/data-display/status-badge';
import { Button } from '@/common/components/ui/button';
import { PriorityLevel, ServiceStatus } from '@/common/types/domain';
import { serviceStatusGlowMap, serviceStatusPanelMap } from '@/common/lib/status-appearance';
import { mechanicTasksMock } from '@/modules/mechanic/mocks/mechanic.mock';
import { mechanicStatusSummaryMock } from '@/modules/mechanic/mocks/mechanic.mock';



const priorityTone = {
  NORMAL: 'border-[color:var(--line)] bg-[color:var(--panel-light)] theme-muted',
  HIGH: 'border-amber-300/24 bg-amber-400/14 text-amber-100',
  URGENT: 'border-rose-300/24 bg-rose-400/14 text-rose-100',
} as const;

export function MechanicTaskPage() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Mekanik</p>
          <h1 className="section-title mt-3">Tugas Saya</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {mechanicStatusSummaryMock.map((item) => (
              <div key={item.status} className={`rounded-[22px] border p-4 ${serviceStatusPanelMap[item.status]} ${serviceStatusGlowMap[item.status]}`}>
                <StatusBadge status={item.status} />
                <p className="mt-4 text-3xl font-semibold tracking-tight theme-text">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[28px] border border-sky-300/22 bg-sky-400/12 shadow-[0_20px_60px_rgba(56,189,248,0.16)]">
          <p className="text-xs uppercase tracking-[0.28em] theme-muted">Fokus</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[20px] border border-[color:var(--line)] bg-[color:var(--panel)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold theme-text">Unit berikutnya untuk test drive</p>
                <StatusBadge status="TEST_DRIVE" />
              </div>
              <p className="mt-3 text-sm theme-muted">JAECOO J8 · AB 9912 OO</p>
            </div>
            <div className="rounded-[20px] border border-rose-300/20 bg-rose-400/12 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold theme-text">Approval tambahan</p>
                <StatusBadge status="TERKENDALA" />
              </div>
              <p className="mt-3 text-sm theme-muted">1 unit menunggu keputusan penggantian part</p>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {mechanicTasksMock.map((task) => (
          <Card key={task.id} className={`space-y-4 border ${serviceStatusPanelMap[task.status]} ${serviceStatusGlowMap[task.status]}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] theme-muted">{task.id}</p>
                <h2 className="mt-2 text-xl font-semibold theme-text">{task.vehicle}</h2>
                <p className="mt-1 text-sm theme-muted">Pelanggan: {task.customer}</p>
              </div>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-sm theme-muted">Keluhan: {task.issue}</p>
            <div className={`inline-flex rounded-[18px] border px-4 py-3 text-sm font-medium ${priorityTone[task.priority]}`}>
              Prioritas {task.priority}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <Button variant="secondary">Mulai</Button>
              <Button variant="secondary">Catatan</Button>
              <Button variant="secondary">Test Drive</Button>
              <Button>Finish</Button>
              <Button variant="danger">Hapus</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
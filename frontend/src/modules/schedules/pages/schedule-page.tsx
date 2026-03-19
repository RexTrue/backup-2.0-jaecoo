import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { ListCard } from '@/common/components/data-display/list-card';
import { PageHeader } from '@/common/components/page/page-header';
import { EmptyState } from '@/common/components/feedback/empty-state';
import { dailyPlanMock } from '@/modules/schedules/mocks/schedule.mock';
import { getLocalEntities } from '@/common/lib/local-entity-store';
import type { CreateSchedulePayload } from '@/modules/schedules/services/schedule-api';

export function SchedulePage() {
  const schedules = useMemo(() => getLocalEntities<CreateSchedulePayload>('schedules'), []);

  const groupedSchedules = useMemo(() => {
    return schedules.reduce<Record<string, CreateSchedulePayload[]>>((acc, item) => {
      const key = item.tanggal || 'Tanpa Tanggal';
      acc[key] = [...(acc[key] ?? []), item].sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));
      return acc;
    }, {});
  }, [schedules]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Jadwal"
        title="Jadwal"
        actions={<Link to="/schedules/new"><Button type="button">Tambah Jadwal Baru +</Button></Link>}
      />
      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-3">
        {dailyPlanMock.map((item) => (
          <Card key={item.slot}>
            <div>
              <p className="text-sm theme-muted">{item.slot}</p>
              <p className="mt-3 text-4xl font-semibold">{item.capacity}</p>
              <p className="mt-4 text-sm theme-muted">{item.note}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {Object.keys(groupedSchedules).length === 0 ? (
          <EmptyState message="Belum ada booking jadwal. Tambahkan jadwal baru untuk mulai melihat pengelompokan per tanggal." />
        ) : (
          <div className="space-y-5">
            {Object.entries(groupedSchedules).map(([date, items]) => (
              <section key={date} className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] theme-muted">Tanggal</p>
                  <h2 className="mt-2 text-xl font-semibold theme-text">{date}</h2>
                </div>
                <div className="grid gap-3">
                  {items.map((item, index) => (
                    <ListCard
                      key={`${item.no_rangka}-${item.jam_mulai}-${index}`}
                      title={`${item.jam_mulai} - ${item.jam_selesai}`}
                      subtitle={(
                        <>
                          <p className="mt-2">{item.keluhan}</p>
                          <p className="mt-1 text-xs theme-muted">NIK {item.nik} · No rangka {item.no_rangka}</p>
                        </>
                      )}
                      meta={<div className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-1 text-xs theme-muted">Booking</div>}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

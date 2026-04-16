import { useMemo } from 'react';
import { getEpicGanttBars } from '../utils/trackerDataAdapter';
import { C } from './MetricsCard';

const STATUS_COLORS: Record<string, string> = {
  'In Progress': C.cyan,
  Done: C.emerald,
  Retired: C.slate,
  Cancelled: C.rose,
  Queued: C.amber,
};

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function EpicGantt() {
  const bars = useMemo(() => getEpicGanttBars(), []);

  const range = useMemo(() => {
    if (bars.length === 0) return null;
    const starts = bars.map((b) => new Date(b.startDate).getTime());
    const ends = bars.map((b) =>
      b.endDate ? new Date(b.endDate).getTime() : Date.now(),
    );
    const min = Math.min(...starts);
    const max = Math.max(...ends, Date.now());
    return { min, max, span: max - min || 1 };
  }, [bars]);

  if (!range || bars.length === 0) {
    return null;
  }

  const tickCount = 6;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const t = range.min + (range.span * i) / tickCount;
    return { left: (i / tickCount) * 100, label: formatShortDate(new Date(t).toISOString()) };
  });

  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: C.cardBg, borderColor: C.border }}
    >
      <h3 className="text-sm font-semibold" style={{ color: C.white }}>
        Epic Timeline
      </h3>
      <div className="text-xs mb-4" style={{ color: C.muted }}>
        {bars.length} epic{bars.length === 1 ? '' : 's'} —{' '}
        {bars.filter((b) => b.status === 'In Progress').length} active,{' '}
        {bars.filter((b) => b.status === 'Done').length} done,{' '}
        {bars.filter((b) => b.status === 'Retired').length} retired
      </div>

      {/* Date axis */}
      <div className="relative" style={{ marginLeft: 180, marginBottom: 8, height: 16 }}>
        {ticks.map((t, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${t.left}%`,
              transform: 'translateX(-50%)',
              fontSize: 10,
              color: C.muted,
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {bars.map((bar) => {
          const startMs = new Date(bar.startDate).getTime();
          const endMs = bar.endDate ? new Date(bar.endDate).getTime() : Date.now();
          const leftPct = ((startMs - range.min) / range.span) * 100;
          const widthPct = Math.max(((endMs - startMs) / range.span) * 100, 1.5);
          const color = STATUS_COLORS[bar.status] ?? C.muted;
          const ongoing = bar.endDate == null;

          return (
            <div
              key={bar.id}
              className="flex items-center gap-2"
              style={{ fontSize: 12 }}
            >
              <div
                style={{
                  width: 180,
                  flexShrink: 0,
                  color: C.white,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={bar.title}
              >
                {bar.title}
              </div>
              <div className="relative flex-1" style={{ height: 22 }}>
                {/* Track background */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: 1,
                    backgroundColor: C.border,
                    opacity: 0.4,
                  }}
                />
                {/* Bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: 14,
                    backgroundColor: `color-mix(in srgb, ${color} 70%, transparent)`,
                    border: `1px solid ${color}`,
                    borderRadius: 4,
                    backgroundImage: ongoing
                      ? `linear-gradient(135deg, ${color}30 25%, transparent 25%, transparent 50%, ${color}30 50%, ${color}30 75%, transparent 75%, transparent)`
                      : undefined,
                    backgroundSize: ongoing ? '8px 8px' : undefined,
                  }}
                  title={`${bar.title} · ${bar.status} · ${formatShortDate(bar.startDate)} → ${
                    bar.endDate ? formatShortDate(bar.endDate) : 'ongoing'
                  } · ${bar.taskCount} task${bar.taskCount === 1 ? '' : 's'}`}
                />
              </div>
              <div
                style={{
                  width: 60,
                  flexShrink: 0,
                  textAlign: 'right',
                  color: C.muted,
                  fontSize: 11,
                }}
              >
                {bar.taskCount} {bar.taskCount === 1 ? 'task' : 'tasks'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          marginTop: 16,
          fontSize: 11,
          color: C.muted,
        }}
      >
        {(['In Progress', 'Done', 'Retired', 'Cancelled', 'Queued'] as const).map((s) => (
          <div
            key={s}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: STATUS_COLORS[s],
              }}
            />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

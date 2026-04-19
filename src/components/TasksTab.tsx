import { useMemo, useState, type ReactNode } from 'react';
import { C } from './MetricsCard';
import {
  getWeeklyTaskBuckets,
  getAllEpics,
  displayTaskId,
} from '../utils/trackerDataAdapter';
import ActiveEpicProgress from './ActiveEpicProgress';

interface TasksTabProps {
  projectId: string;
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

const EPIC_PALETTE = [
  '#22d3ee', '#a78bfa', '#f59e0b', '#34d399', '#f43f5e',
  '#60a5fa', '#fbbf24', '#818cf8', '#2dd4bf', '#fb923c',
  '#94a3b8', '#c084fc', '#facc15', '#4ade80',
];

function formatWeek(weekStart: string): string {
  const d = new Date(weekStart);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTaskDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STATUS_COLOR: Record<string, string> = {
  Done: C.emerald,
  'In Progress': C.cyan,
  Queued: C.amber,
  Blocked: C.rose,
  Cancelled: C.slate,
  Retired: C.muted,
};

const TOOL_COLOR: Record<string, string> = {
  'claude-code': C.emerald,
  'claude-ai': C.cyan,
  cursor: C.amber,
  cowork: C.slate,
  manual: C.violet,
  mixed: C.violet,
};

export default function TasksTab({ projectId, setTooltip }: TasksTabProps) {
  const buckets = useMemo(() => getWeeklyTaskBuckets(), []);
  const allEpics = useMemo(() => getAllEpics(), []);

  // Color assignment per epic by index
  const epicColor = useMemo(() => {
    const map = new Map<string, string>();
    allEpics.forEach((e, i) => {
      map.set(e.id, EPIC_PALETTE[i % EPIC_PALETTE.length]);
    });
    map.set('unassigned', C.muted);
    return map;
  }, [allEpics]);

  const epicTitle = useMemo(() => {
    const map = new Map<string, string>();
    allEpics.forEach((e) => map.set(e.id, e.title));
    map.set('unassigned', 'Unassigned');
    return map;
  }, [allEpics]);

  // Default expand state: most recent 4 weeks
  const initialExpanded = useMemo(() => {
    const recent = buckets.slice(-4).map((b) => b.weekStart);
    return new Set(recent);
  }, [buckets]);
  const [expanded, setExpanded] = useState<Set<string>>(initialExpanded);

  const toggleWeek = (weekStart: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(weekStart)) next.delete(weekStart);
      else next.add(weekStart);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <ActiveEpicProgress projectId={projectId} setTooltip={setTooltip} />

      {/* Task list grouped by week */}
      <div className="space-y-2">
        {[...buckets].reverse().map((bucket) => {
          const isExpanded = expanded.has(bucket.weekStart);
          const totalPRs = bucket.tasks.reduce(
            (sum, t) => sum + (t.outputs ?? []).filter((o) => o.type === 'PR').length,
            0,
          );
          return (
            <div
              key={bucket.weekStart}
              className="rounded-xl border"
              style={{ backgroundColor: C.cardBg, borderColor: C.border }}
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => toggleWeek(bucket.weekStart)}
                className="flex w-full items-center justify-between p-4 text-left"
                style={{ color: C.white, cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: C.muted, fontSize: 11 }}>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    Week of {formatWeek(bucket.weekStart)}
                  </span>
                </div>
                <div className="flex items-center gap-3" style={{ fontSize: 12 }}>
                  <span style={{ color: C.cyan }}>
                    {bucket.tasks.length} task{bucket.tasks.length === 1 ? '' : 's'}
                  </span>
                  <span style={{ color: C.emerald }}>
                    {totalPRs} PR{totalPRs === 1 ? '' : 's'}
                  </span>
                </div>
              </button>
              {isExpanded && (
                <div
                  className="border-t"
                  style={{ borderColor: C.border, padding: '8px 16px 16px' }}
                >
                  {bucket.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="border-b py-2 last:border-b-0"
                      style={{
                        borderColor: `color-mix(in srgb, ${C.border} 60%, transparent)`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            className="flex items-center gap-2 flex-wrap"
                            style={{ fontSize: 13 }}
                          >
                            <span style={{ color: C.muted, fontSize: 11 }}>
                              #{displayTaskId(task.id)}
                            </span>
                            <span style={{ color: C.white, fontWeight: 500 }}>
                              {task.title}
                            </span>
                            {task.decisions && task.decisions.length > 0 && (
                              <span
                                onMouseEnter={(e) => {
                                  setTooltip({
                                    x: e.clientX,
                                    y: e.clientY,
                                    content: (
                                      <>
                                        <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>
                                          {task.decisions.length} decision{task.decisions.length === 1 ? '' : 's'}
                                        </div>
                                        {task.decisions.map((d) => (
                                          <div key={d.id} style={{ color: C.amber, fontSize: 11 }}>
                                            • {d.title}
                                          </div>
                                        ))}
                                      </>
                                    ),
                                  });
                                }}
                                onMouseMove={(e) => {
                                  setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev));
                                }}
                                onMouseLeave={() => setTooltip(null)}
                                style={{
                                  color: C.amber,
                                  fontSize: 12,
                                  cursor: 'help',
                                }}
                              >
                                ◆
                              </span>
                            )}
                            {task.events && task.events.length > 0 && (
                              <span
                                onMouseEnter={(e) => {
                                  setTooltip({
                                    x: e.clientX,
                                    y: e.clientY,
                                    content: (
                                      <>
                                        <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>
                                          {task.events.length} event{task.events.length === 1 ? '' : 's'}
                                        </div>
                                        {task.events.map((ev, i) => (
                                          <div key={i} style={{ color: C.slate, fontSize: 11 }}>
                                            <span style={{ color: C.muted }}>{ev.type}:</span> {ev.note}
                                          </div>
                                        ))}
                                      </>
                                    ),
                                  });
                                }}
                                onMouseMove={(e) => {
                                  setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev));
                                }}
                                onMouseLeave={() => setTooltip(null)}
                                style={{
                                  color: C.slate,
                                  fontSize: 10,
                                  cursor: 'help',
                                }}
                              >
                                ●
                              </span>
                            )}
                          </div>
                          <div
                            className="flex items-center gap-2 flex-wrap"
                            style={{ marginTop: 4 }}
                          >
                            {task.epic && (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px]"
                                style={{
                                  backgroundColor: `color-mix(in srgb, ${
                                    epicColor.get(task.epic) ?? C.muted
                                  } 18%, transparent)`,
                                  color: epicColor.get(task.epic) ?? C.muted,
                                }}
                              >
                                {epicTitle.get(task.epic) ?? task.epic}
                              </span>
                            )}
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px]"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${
                                  STATUS_COLOR[task.status] ?? C.muted
                                } 18%, transparent)`,
                                color: STATUS_COLOR[task.status] ?? C.muted,
                              }}
                            >
                              {task.status}
                            </span>
                            {task.tool && (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px]"
                                style={{
                                  backgroundColor: `color-mix(in srgb, ${
                                    TOOL_COLOR[task.tool] ?? C.muted
                                  } 14%, transparent)`,
                                  color: TOOL_COLOR[task.tool] ?? C.muted,
                                }}
                              >
                                {task.tool}
                              </span>
                            )}
                            {(task.outputs ?? [])
                              .filter((o) => o.type === 'PR')
                              .map((o) => (
                                <span
                                  key={`pr-${o.ref}`}
                                  className="rounded-full px-2 py-0.5 text-[10px]"
                                  style={{
                                    backgroundColor: `color-mix(in srgb, ${C.emerald} 14%, transparent)`,
                                    color: C.emerald,
                                  }}
                                >
                                  PR #{o.ref}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div
                          style={{
                            color: C.muted,
                            fontSize: 11,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatTaskDate(task.dates?.completed)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

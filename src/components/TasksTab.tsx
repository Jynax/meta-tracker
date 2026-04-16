import { useMemo, useState, type ReactNode } from 'react';
import { C } from './MetricsCard';
import {
  getWeeklyTaskBuckets,
  getDecisionPins,
  getAllEpics,
  getAllTasks,
} from '../utils/trackerDataAdapter';

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

export default function TasksTab({ setTooltip }: TasksTabProps) {
  const buckets = useMemo(() => getWeeklyTaskBuckets(), []);
  const pins = useMemo(() => getDecisionPins(), []);
  const allEpics = useMemo(() => getAllEpics(), []);
  const allTasks = useMemo(() => getAllTasks(), []);

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

  // Top-level driver/tool distribution for header pill row
  const driverDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of allTasks) {
      if (t.status !== 'Done') continue;
      const key = t.driver ?? 'unspecified';
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [allTasks]);

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

  // Chart dimensions
  const chartDims = { width: 920, height: 240, left: 40, right: 20, top: 20, bottom: 40 };
  const innerW = chartDims.width - chartDims.left - chartDims.right;
  const innerH = chartDims.height - chartDims.top - chartDims.bottom;

  const maxStack = Math.max(1, ...buckets.map((b) => b.tasks.length));
  const yTickCount = 4;
  const niceMax = Math.ceil(maxStack / yTickCount) * yTickCount;
  const barGroupWidth = buckets.length > 0 ? innerW / buckets.length : 0;
  const barWidth = Math.max(8, barGroupWidth * 0.6);

  // Map week → decision count for pin overlays
  const weekDecisionCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of pins) {
      const d = new Date(p.date);
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((day + 6) % 7));
      const key = monday.toISOString().slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [pins]);

  return (
    <div className="space-y-4">
      {/* Driver distribution pill row */}
      <div
        className="rounded-xl border p-4"
        style={{ backgroundColor: C.cardBg, borderColor: C.border }}
      >
        <h3 className="text-sm font-semibold" style={{ color: C.white }}>
          Task Throughput
        </h3>
        <div className="text-xs mb-3" style={{ color: C.muted }}>
          {allTasks.filter((t) => t.status === 'Done').length} tasks completed —{' '}
          {Object.entries(driverDistribution).map(([k, v], i, arr) => (
            <span key={k}>
              {v} {k}
              {i < arr.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>

        {/* Weekly throughput chart */}
        {buckets.length === 0 ? (
          <div style={{ color: C.muted, fontSize: 12 }}>No completed tasks yet.</div>
        ) : (
          <svg
            viewBox={`0 0 ${chartDims.width} ${chartDims.height}`}
            style={{ width: '100%', height: 240 }}
            role="img"
            aria-label="Weekly task throughput chart"
          >
            {/* Grid */}
            {Array.from({ length: yTickCount + 1 }, (_, i) => {
              const v = (i * niceMax) / yTickCount;
              const y = chartDims.top + innerH - (i / yTickCount) * innerH;
              return (
                <g key={i}>
                  <line
                    x1={chartDims.left}
                    y1={y}
                    x2={chartDims.width - chartDims.right}
                    y2={y}
                    stroke={C.border}
                    strokeDasharray="4 4"
                    strokeOpacity="0.3"
                  />
                  <text
                    x={chartDims.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill={C.slate}
                    fontSize="10"
                  >
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Stacked bars per week */}
            {buckets.map((bucket, idx) => {
              const xCenter =
                chartDims.left + idx * barGroupWidth + barGroupWidth / 2;
              const xLeft = xCenter - barWidth / 2;
              let cumulative = 0;

              const segments = [...bucket.byEpic.entries()].map(([epicId, tasks]) => {
                const segHeight = (tasks.length / niceMax) * innerH;
                const y =
                  chartDims.top + innerH - (cumulative + tasks.length) / niceMax * innerH;
                cumulative += tasks.length;
                return {
                  epicId,
                  y,
                  height: segHeight,
                  count: tasks.length,
                  color: epicColor.get(epicId) ?? C.muted,
                };
              });

              const decisionCount = weekDecisionCount.get(bucket.weekStart) ?? 0;

              return (
                <g key={bucket.weekStart}>
                  {segments.map((seg) => (
                    <rect
                      key={seg.epicId}
                      x={xLeft}
                      y={seg.y}
                      width={barWidth}
                      height={Math.max(seg.height, 1)}
                      fill={seg.color}
                      opacity={0.85}
                      onMouseEnter={(e) => {
                        setTooltip({
                          x: e.clientX,
                          y: e.clientY,
                          content: (
                            <>
                              <div
                                style={{ color: C.white, fontSize: 12, fontWeight: 600 }}
                              >
                                Week of {formatWeek(bucket.weekStart)}
                              </div>
                              <div style={{ color: seg.color, fontSize: 11 }}>
                                {epicTitle.get(seg.epicId)}: {seg.count} task
                                {seg.count === 1 ? '' : 's'}
                              </div>
                            </>
                          ),
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                  {/* Decision pin */}
                  {decisionCount > 0 && (
                    <g
                      onMouseEnter={(e) => {
                        const decisionsThisWeek = pins.filter((p) => {
                          const d = new Date(p.date);
                          const day = d.getDay();
                          const monday = new Date(d);
                          monday.setDate(d.getDate() - ((day + 6) % 7));
                          return monday.toISOString().slice(0, 10) === bucket.weekStart;
                        });
                        setTooltip({
                          x: e.clientX,
                          y: e.clientY,
                          content: (
                            <>
                              <div
                                style={{ color: C.white, fontSize: 12, fontWeight: 600 }}
                              >
                                Decisions ({decisionCount})
                              </div>
                              {decisionsThisWeek.map((d) => (
                                <div
                                  key={d.decision.id}
                                  style={{ color: C.amber, fontSize: 11 }}
                                >
                                  • {d.decision.title}
                                </div>
                              ))}
                            </>
                          ),
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <polygon
                        points={`${xCenter},${chartDims.top + 4} ${xCenter + 6},${
                          chartDims.top + 10
                        } ${xCenter},${chartDims.top + 16} ${xCenter - 6},${
                          chartDims.top + 10
                        }`}
                        fill={C.amber}
                        stroke={C.white}
                        strokeWidth="0.5"
                      />
                      {decisionCount > 1 && (
                        <text
                          x={xCenter}
                          y={chartDims.top + 13}
                          textAnchor="middle"
                          fill={C.bg}
                          fontSize="8"
                          fontWeight="700"
                        >
                          {decisionCount}
                        </text>
                      )}
                    </g>
                  )}
                  {/* X label every Nth week */}
                  {(idx % Math.max(1, Math.floor(buckets.length / 12)) === 0 ||
                    idx === buckets.length - 1) && (
                    <text
                      x={xCenter}
                      y={chartDims.height - chartDims.bottom + 14}
                      textAnchor="middle"
                      fill={C.slate}
                      fontSize="10"
                    >
                      {formatWeek(bucket.weekStart)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Compact epic legend */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 12,
            fontSize: 10,
            color: C.muted,
          }}
        >
          {[...new Set(buckets.flatMap((b) => [...b.byEpic.keys()]))]
            .sort((a, b) => (epicTitle.get(a) ?? '').localeCompare(epicTitle.get(b) ?? ''))
            .map((eid) => (
              <div
                key={eid}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: epicColor.get(eid),
                  }}
                />
                <span>{epicTitle.get(eid)}</span>
              </div>
            ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: C.amber, fontSize: 12 }}>◆</span>
            <span>Decision</span>
          </div>
        </div>
      </div>

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
                              #{task.id}
                            </span>
                            <span style={{ color: C.white, fontWeight: 500 }}>
                              {task.title}
                            </span>
                            {task.decisions && task.decisions.length > 0 && (
                              <span
                                title={task.decisions.map((d) => d.title).join(', ')}
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
                                title={task.events.map((e) => `${e.type}: ${e.note}`).join('\n')}
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

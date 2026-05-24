import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { getEpicCumulativeSeries } from '../utils/trackerDataAdapter';

interface ActiveEpicProgressProps {
  projectId: string;
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

export default function ActiveEpicProgress({ projectId: _projectId, setTooltip }: ActiveEpicProgressProps) {
  const [includeAll, setIncludeAll] = useState(false);
  const [now] = useState(() => new Date());

  const series = useMemo(
    () =>
      getEpicCumulativeSeries({
        now,
        windowDays: 30,
        plotWindowWeeks: 8,
        cap: 6,
        includeAll,
      }),
    [includeAll, now],
  );

  const PLOT = { left: 70, right: 700, top: 40, bottom: 260 };

  const maxY = useMemo(() => {
    const max = Math.max(0, ...series.flatMap((s) => s.points.map((p) => p.cumulative)));
    if (max <= 3) return 3;
    return Math.ceil(max / 3) * 3;
  }, [series]);

  const allWeeks = useMemo(() => {
    const set = new Set<string>();
    for (const s of series) for (const p of s.points) set.add(p.weekStart);
    return [...set].sort();
  }, [series]);

  const xScale = useCallback((weekStart: string) => {
    if (allWeeks.length === 0) return (PLOT.left + PLOT.right) / 2;
    if (allWeeks.length === 1) return (PLOT.left + PLOT.right) / 2;
    const i = allWeeks.indexOf(weekStart);
    if (i < 0) return PLOT.left;
    const t = i / (allWeeks.length - 1);
    return PLOT.left + t * (PLOT.right - PLOT.left);
  }, [allWeeks, PLOT.left, PLOT.right]);

  const yScale = useCallback(
    (cum: number) => PLOT.bottom - (cum / maxY) * (PLOT.bottom - PLOT.top),
    [PLOT.bottom, PLOT.top, maxY],
  );

  const yTicks = [0, maxY / 3, (2 * maxY) / 3, maxY].map((v) => Math.round(v));

  // Compute adjusted y for each curve-end label to avoid collision.
  const labelYByEpic = useMemo(() => {
    const entries = series.map((s) => {
      const last = s.points[s.points.length - 1];
      // For empty-points stalled, anchor at the y=0 baseline
      const y = last ? yScale(last.cumulative) : yScale(0);
      return { epicId: s.epicId, y };
    });
    entries.sort((a, b) => a.y - b.y);
    const MIN_GAP = 14;
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].y - entries[i - 1].y < MIN_GAP) {
        entries[i].y = entries[i - 1].y + MIN_GAP;
      }
    }
    return new Map(entries.map((e) => [e.epicId, e.y]));
  }, [series, yScale]);

  const totalQualifyingCount = useMemo(() => {
    if (includeAll) return series.length;
    const all = getEpicCumulativeSeries({
      now,
      windowDays: 30,
      plotWindowWeeks: 8,
      cap: Number.POSITIVE_INFINITY,
      includeAll: false,
    });
    return all.length;
  }, [includeAll, series, now]);
  const hiddenCount = Math.max(0, totalQualifyingCount - series.length);

  return (
    <div
      data-testid="active-epic-progress"
      style={{
        background: '#0f1419',
        border: '1px solid #1e293b',
        borderRadius: 10,
        padding: '16px 20px 20px',
        color: '#e2e8f0',
        fontFamily: 'ui-sans-serif, system-ui',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>Active Epic Progress</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Cumulative tasks completed — last 30 days + stalled
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setIncludeAll(false)}
            aria-pressed={!includeAll}
            style={toggleStyle(!includeAll)}
          >
            Active + stalled
          </button>
          <button
            type="button"
            onClick={() => setIncludeAll(true)}
            aria-pressed={includeAll}
            style={toggleStyle(includeAll)}
          >
            All epics
          </button>
        </div>
      </div>

      <svg viewBox="0 0 900 300" width="100%" style={{ marginTop: 14 }} role="img" aria-label={`Cumulative task completion chart, ${series.length} epics visible`}>
        {/* gridlines */}
        {yTicks.slice(1).map((v) => (
          <line key={v} x1={PLOT.left} y1={yScale(v)} x2={PLOT.right} y2={yScale(v)} stroke="#1e293b" strokeWidth={1} />
        ))}
        {/* axes */}
        <line x1={PLOT.left} y1={PLOT.bottom} x2={PLOT.right} y2={PLOT.bottom} stroke="#334155" strokeWidth={1} />
        <line x1={PLOT.left} y1={PLOT.top} x2={PLOT.left} y2={PLOT.bottom} stroke="#334155" strokeWidth={1} />
        {/* y-axis labels */}
        {yTicks.map((v) => (
          <text key={v} x={PLOT.left - 7} y={yScale(v) + 3} textAnchor="end" fill="#64748b" fontSize={10}>
            {v}
          </text>
        ))}
        <text x={30} y={(PLOT.top + PLOT.bottom) / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90 30 ${(PLOT.top + PLOT.bottom) / 2})`}>
          tasks (cumulative)
        </text>
        {/* x-axis labels — thin to max 6 visible */}
        {allWeeks.map((w, i) => {
          const every = Math.max(1, Math.ceil(allWeeks.length / 6));
          if (i % every !== 0 && i !== allWeeks.length - 1) return null;
          return (
            <text key={w} x={xScale(w)} y={PLOT.bottom + 18} textAnchor="middle" fill="#64748b" fontSize={10}>
              {formatTick(w)}
            </text>
          );
        })}
        {/* curves */}
        {series.map((s) => {
          const isStalled = s.stalled;
          const stroke = isStalled ? '#fbbf24' : s.color;

          // Empty-points case: never-started stalled epic — draw flat dashed placeholder
          if (s.points.length === 0) {
            const placeholderY = yScale(0);
            const rightX = PLOT.right;
            return (
              <g key={s.epicId}>
                <line
                  x1={PLOT.left}
                  y1={placeholderY}
                  x2={PLOT.right}
                  y2={placeholderY}
                  stroke={stroke}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                />
                <circle cx={rightX} cy={placeholderY} r={5} fill="none" stroke={stroke} strokeWidth={1} />
                <circle cx={rightX} cy={placeholderY} r={8} fill="none" stroke={stroke} strokeWidth={0.5} strokeDasharray="2 2" opacity={0.5} />
                <text
                  x={rightX + 10}
                  y={(labelYByEpic.get(s.epicId) ?? placeholderY) + 4}
                  fill={stroke}
                  fontSize={11}
                  fontWeight={600}
                  className="curve-label"
                  data-epic-id={s.epicId}
                  data-stalled="true"
                >
                  {s.epicTitle} · 0 · stalled
                </text>
              </g>
            );
          }

          // Normal case: render polyline + points + (if stalled) ring
          const pointsStr = s.points.map((p) => `${xScale(p.weekStart)},${yScale(p.cumulative)}`).join(' ');
          const last = s.points[s.points.length - 1];
          const lastX = xScale(last.weekStart);
          const lastY = yScale(last.cumulative);
          return (
            <g key={s.epicId}>
              <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={2.5}
                strokeDasharray={isStalled ? '5 4' : undefined}
                points={pointsStr}
              />
              {s.points.map((p, i) => {
                const isLast = i === s.points.length - 1;
                return (
                  <circle
                    key={i}
                    cx={xScale(p.weekStart)}
                    cy={yScale(p.cumulative)}
                    r={isLast ? 3.5 : 3}
                    fill={stroke}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        content: (
                          <div style={{ minWidth: 160 }}>
                            <div style={{ fontWeight: 600 }}>{s.epicTitle}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>Week of {p.weekStart}</div>
                            {p.delta > 0 && <div style={{ fontSize: 11 }}>+{p.delta} this week</div>}
                            <div style={{ fontSize: 11 }}>Cumulative: {p.cumulative}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>
                              Status: {isStalled ? 'stalled' : s.status}
                            </div>
                          </div>
                        ),
                      })
                    }
                    onMouseMove={(e) =>
                      setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev))
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
              {isStalled && (
                <>
                  <circle cx={lastX} cy={lastY} r={5} fill="none" stroke="#fbbf24" strokeWidth={1} />
                  <circle cx={lastX} cy={lastY} r={8} fill="none" stroke="#fbbf24" strokeWidth={0.5} strokeDasharray="2 2" opacity={0.5} />
                </>
              )}
              <text
                x={lastX + 10}
                y={(labelYByEpic.get(s.epicId) ?? lastY) + 4}
                fill={stroke}
                fontSize={11}
                fontWeight={600}
                className="curve-label"
                data-epic-id={s.epicId}
                data-stalled={isStalled ? 'true' : 'false'}
              >
                {s.epicTitle} · {s.totalCompleted}
                {isStalled ? ' · stalled' : s.status === 'Done' ? ' · done' : ''}
              </text>
            </g>
          );
        })}
      </svg>
      {series.length === 0 && (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: 12, padding: '16px 0' }}>
          No active epics. Toggle "All epics" to see the full history.
        </div>
      )}
      {hiddenCount > 0 && (
        <div style={{ marginTop: 8, paddingTop: 10, borderTop: '1px solid #1e293b', fontSize: 11, color: '#64748b' }}>
          <strong style={{ color: '#94a3b8' }}>{hiddenCount} {hiddenCount === 1 ? 'epic' : 'epics'} hidden by filter</strong> — click "All epics" to reveal.
        </div>
      )}
    </div>
  );
}

function toggleStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 11,
    padding: '4px 10px',
    border: `1px solid ${active ? '#475569' : '#334155'}`,
    borderRadius: 14,
    background: active ? '#1e293b' : '#0f1419',
    color: active ? '#e2e8f0' : '#94a3b8',
    cursor: 'pointer',
  };
}

function formatTick(isoWeekStart: string): string {
  const d = new Date(isoWeekStart + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
